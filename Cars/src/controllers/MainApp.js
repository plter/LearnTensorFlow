const tf = require("@tensorflow/tfjs");
const tf_coco_ssd = require("@tensorflow-models/coco-ssd");
const Dialog = require("../compoents/Dialog");
const TrafficLights = require("./TrafficLights");

module.exports = Vue.component("main-app", {
    template: `
<div style="padding: 10px;">
    <div style="display: flex;flex-direction: row;">
        <div class="card">
            <div class="card-header">南北{{snCount}},近期总数{{snCountsRecent}}</div>
            <div style="position: relative;">
                <canvas style="display: block;position: absolute;" width="320" height="180" ref="snCarsBoundsCanvas"></canvas>
                <video style="display: block;" width="320" height="180" muted src="res/videos/SN.mp4" ref="monitorSN" loop></video>
            </div>
        </div>
        <div class="card" style="margin-left: 10px;">
            <div class="card-header">东西{{ewCount}}，近期总数{{ewCountsRecent}}</div>
            <div style="position: relative;">
                <video style="display: block;" width="320" height="180" muted src="res/videos/EW.mp4" ref="monitorEW" loop></video>
            </div>
        </div>
    </div>
    <traffic-lights ref="lights"></traffic-lights>
</div>`,

    data() {
        return {
            snCount: 0,
            ewCount: 0,
            snCountsRecentArray: [],
            ewCountsRecentArray: []
        }
    },

    async mounted() {
        let d = Dialog.showLoading("正在加载模型，请稍候...");

        /**
         * @type {ObjectDetection}
         */
        this.model = await tf_coco_ssd.load({
            modelUrl: "models/ssdlite_mobilenet_v2/model.json"
        });

        console.log(this.model);

        d.modal("hide");

        /**
         * @type {OffscreenCanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext | (WebGLRenderingContext & WebGL1Extensions) | CanvasRenderingContext2D}
         */
        this.snCardsBoundsCanvasContext2D = this.$refs.snCarsBoundsCanvas.getContext("2d");
        this.snCardsBoundsCanvasContext2D.strokeStyle = "red";

        this.playMonitor();
        this.startDetectProcess();
    },

    computed: {
        snCountsRecent() {
            let c = 0;
            this.snCountsRecentArray.forEach(value => {
                c += value;
            });
            return c;
        },

        ewCountsRecent() {
            let c = 0;
            this.ewCountsRecentArray.forEach(value => {
                c += value;
            });
            return c;
        }
    },

    methods: {
        playMonitor() {
            this.$refs.monitorSN.play();
            this.$refs.monitorEW.play();
        },

        startDetectProcess() {
            setInterval(async () => {
                let snRects = await this.model.detect(this.$refs.monitorSN);
                let ewRects = await this.model.detect(this.$refs.monitorEW);
                this.snCount = snRects.length;
                this.ewCount = ewRects.length;

                this.snCountsRecentArray.splice(0, 0, this.snCount);
                if (this.snCountsRecentArray.length >= 10) {
                    this.snCountsRecentArray.length = 10;
                }

                this.ewCountsRecentArray.splice(0, 0, this.ewCount);

                if (this.ewCountsRecentArray.length >= 10) {
                    this.ewCountsRecentArray.length = 10;
                }

                if (this.ewCountsRecent > this.snCountsRecent) {
                    this.$refs.lights.ewClearanceDuration = 20;
                    this.$refs.lights.snClearanceDuration = 10;
                } else {
                    this.$refs.lights.ewClearanceDuration = 10;
                    this.$refs.lights.snClearanceDuration = 20;
                }

            }, 1000);
        }
    }
});
