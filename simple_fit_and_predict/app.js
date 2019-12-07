const tf = require("@tensorflow/tfjs-node");
const path = require("path");

(async function () {
    const model = tf.sequential({
        layers: [
            tf.layers.dense({inputShape: [3], units: 32, activation: 'relu'}),
            tf.layers.dense({units: 4, activation: 'softmax'}),
        ]
    });

    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });


    await model.fit(
        tf.tensor([
            [1, 1, 1],
            [1, 0, 1],
            [0, 0, 1],
            [0, 0, 0]
        ]),
        tf.tensor([
            tf.oneHot(3, 4).arraySync(),
            tf.oneHot(2, 4).arraySync(),
            tf.oneHot(1, 4).arraySync(),
            tf.oneHot(0, 4).arraySync()
        ]),
        {epochs: 1000}
    );
    //
    // await model.save("file://" + path.join(__dirname, "models"));
    // let modelDirUrl = "file://" + path.join(__dirname, "models", "model.json");

    // let model = await tf.loadLayersModel(modelDirUrl);

    let predictions = await model.predict(tf.tensor([[0, 0, 0]]));
    predictions.print();

})();
