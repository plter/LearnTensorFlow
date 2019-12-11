(function () {

    let canvas = document.querySelector("canvas");
    let canvasJq = $(canvas);
    let numPreview = document.querySelector("#num-preview");
    let IMAGE_WIDTH = 28, IMAGE_HEIGHT = 28;
    let trainStatusDiv = $("#train-status");
    let recognizeResultDiv = $("#result");
    let model = tf.sequential({
        layers: [
            tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
            tf.layers.dense({units: 10, activation: 'softmax'}),
        ]
    });

    /**
     *
     * @type {CanvasRenderingContext2D | null}
     */
    let context2d = canvas.getContext("2d");

    let numPreviewContext2d = numPreview.getContext("2d");


    function canvas_mouseMoveHandler(e) {
        let jqOffset = canvasJq.offset();
        let x = e.pageX - jqOffset.left;
        let y = e.pageY - jqOffset.top;
        context2d.lineTo(x, y);
        context2d.stroke();
    }

    function showPreviewPhoto() {
        numPreviewContext2d.fillStyle = "#ffffff";
        numPreviewContext2d.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        numPreviewContext2d.drawImage(canvas, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    }

    function canvas_mouseUpHandler() {
        canvas.onmousemove = null;
        canvas.onmouseup = null;

        showPreviewPhoto();
    }

    function canvas_mouseDownHandler(e) {
        canvas.onmousemove = canvas_mouseMoveHandler;
        canvas.onmouseup = canvas_mouseUpHandler;

        context2d.beginPath();
        context2d.lineWidth = 20;
        context2d.lineCap = "round";
        context2d.lineJoin = "round";

        let jqOffset = canvasJq.offset();
        let x = e.pageX - jqOffset.left;
        let y = e.pageY - jqOffset.top;
        context2d.moveTo(x, y);
    }

    function clearCanvas() {
        context2d.clearRect(0, 0, canvas.width, canvas.height);
        showPreviewPhoto();
    }

    function getPhotoDataArray() {
        let photoData = numPreviewContext2d.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        let photoDataArray = [];
        for (let i = 0; i < photoData.data.length; i += 4) {
            let r = photoData.data[i];
            let g = photoData.data[i + 1];
            let b = photoData.data[i + 2];
            let color = Math.round((r + g + b) / 3);
            photoDataArray.push(Math.round((255 - color) / 255));
        }
        return photoDataArray;
    }

    function buildRecognizeResultView(result) {
        recognizeResultDiv.empty();
        recognizeResultDiv.append(`<div>识别结果：${result.result}</div>`);
        recognizeResultDiv.append("<table class='table-bordered'><tbody></tbody></table>");
        let tBody = recognizeResultDiv.find("tbody");

        result.prediction.forEach((value, index) => {
            $("<tr></tr>").appendTo(tBody).append(`<td>${index}</td>`).append(`<td>${value}</td>`);
        });
    }

    async function recognizeNumber() {
        let photoDataArray = getPhotoDataArray();

        recognizeResultDiv.html(`正在预测...`);

        let result = await model.predict(tf.tensor([photoDataArray]));
        result.print();
        let firstResultMaxNumIndex = result.argMax(1);
        firstResultMaxNumIndex.print();
        recognizeResultDiv.html("Result:" + firstResultMaxNumIndex.arraySync()[0]);
    }

    async function train() {
        let targetNumStr = $("#target-num").val();
        if (!targetNumStr) {
            trainStatusDiv.html('<span style="color: red;">请输入关联数字</span>');
            return;
        }

        let targetNum = parseInt(targetNumStr);
        if (targetNum > 9 || targetNum < 0) {
            trainStatusDiv.html("<span style='color: red;'>数字只能为 0,1,2,3,4,5,6,7,8,9 之一</span>");
            return;
        }

        trainStatusDiv.html(`<span style="color: blue">正在训练...</span>`);
        let photoDataArray = getPhotoDataArray();
        console.log("X:");
        console.log(photoDataArray);
        console.log("Y:");
        let target = tf.oneHot(targetNum, 10);
        target.print();
        await model.fit(
            tf.tensor([photoDataArray]),
            tf.tensor([target.arraySync()]), {
                epochs: 100,
                callbacks: {
                    onEpochEnd(epoch, logs) {
                        console.log(epoch, logs);
                        if (logs) {
                            trainStatusDiv.html(`<span style="color: blue;">Step: ${epoch}<br>Loss: ${logs.loss}</span>`);
                        }
                    }
                }
            }
        );
        trainStatusDiv.html("<span style='color: green;'>完成</span>")
    }

    function addListeners() {
        canvas.onmousedown = canvas_mouseDownHandler;
        $("#btn-clear").click(clearCanvas);
        $("#btn-train").click(train);
        $("#btn-recognize").click(recognizeNumber);
    }

    function main() {
        model.compile({
            optimizer: 'adam',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        addListeners();
    }

    main();
})();