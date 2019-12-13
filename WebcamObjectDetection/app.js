(async function () {

    const WIDTH = 480, HEIGHT = 320;

    let detecting = false;

    //Load model
    let model = await cocoSsd.load({
        modelUrl: "models/ssdlite_mobilenet_v2/model.json"
    });

    let video = document.querySelector("video");
    video.srcObject = await navigator.mediaDevices.getUserMedia({
        video: {
            width: WIDTH,
            height: HEIGHT
        }, audio: false
    });
    let canvas = document.querySelector("canvas");
    let context2d = canvas.getContext("2d");
    context2d.strokeStyle = "red";
    context2d.lineWidth = 3;

    function renderCanvas() {
        context2d.clearRect(0, 0, WIDTH, HEIGHT);
        context2d.drawImage(video, 0, 0, WIDTH, HEIGHT);

        if (!detecting) {
            detecting = true;
            model.detect(video).then(predictions => {
                predictions.forEach(r => {
                    context2d.strokeRect(r.bbox[0], r.bbox[1], r.bbox[2], r.bbox[3]);
                });
                detecting = false;
            }).catch(reason => {
                console.log("Waiting for video ready.");
                detecting = false;
            });
        }

        requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
})();