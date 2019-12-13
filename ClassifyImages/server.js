// const tf = require("@tensorflow/tfjs-node");
const mn = require("@tensorflow-models/mobilenet");

(async function () {
    const model = await mn.load();
    console.log(model);
})();