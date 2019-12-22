module.exports = Vue.component("traffic-lights", {
    template: `
<div style="display: flex;flex-direction: row;margin-top: 10px;">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300" viewBox="0 0 300 300">
          <defs>
            <clipPath id="clip-road">
              <rect width="300" height="300"/>
            </clipPath>
          </defs>
          <g id="road" clip-path="url(#clip-road)">
            <rect width="300" height="300" fill="#2b5f18"/>
            <g id="backgroud">
              <rect id="Rectangle_1" data-name="Rectangle 1" width="300" height="60" transform="translate(0 120)" fill="#4e4e4e"/>
              <rect id="Rectangle_2" data-name="Rectangle 2" width="300" height="60" transform="translate(180) rotate(90)" fill="#4e4e4e"/>
              <line id="Line_1" data-name="Line 1" y2="120" transform="translate(150.5 0.5)" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10"/>
              <line id="Line_2" data-name="Line 2" x2="120" transform="translate(0.5 150.5)" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10"/>
              <line id="Line_3" data-name="Line 3" x2="120" transform="translate(180.5 150.5)" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10"/>
              <line id="Line_4" data-name="Line 4" y2="120" transform="translate(150.5 180.5)" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10"/>
              <line id="Line_5" data-name="Line 5" y2="120" transform="translate(180.5 0.5)" fill="none" stroke="#fff" stroke-width="3"/>
              <line id="Line_6" data-name="Line 6" y2="120" transform="translate(120.5 0.5)" fill="none" stroke="#fff" stroke-width="3"/>
              <line id="Line_7" data-name="Line 7" y1="1" x2="120" transform="translate(0.5 120.5)" fill="none" stroke="#fff" stroke-width="3"/>
              <line id="Line_8" data-name="Line 8" y1="1" x2="120" transform="translate(0.5 179.5)" fill="none" stroke="#fff" stroke-width="3"/>
              <line id="Line_9" data-name="Line 9" y1="1" x2="120" transform="translate(180.5 178.5)" fill="none" stroke="#fff" stroke-width="3"/>
              <line id="Line_10" data-name="Line 10" y1="1" x2="120" transform="translate(180.5 120.5)" fill="none" stroke="#fff" stroke-width="3"/>
              <line id="Line_11" data-name="Line 11" y2="121" transform="translate(180.5 179.5)" fill="none" stroke="#fff" stroke-width="3"/>
              <line id="Line_12" data-name="Line 12" y2="121" transform="translate(120.5 179.5)" fill="none" stroke="#fff" stroke-width="3"/>
            </g>
            <g id="light_ew" transform="translate(135 145)">
              <rect id="Rectangle_3" data-name="Rectangle 3" width="32" height="12" fill="red"/>
            </g>
            <g id="light_sn" transform="translate(145 135)">
              <rect id="Rectangle_4" data-name="Rectangle 4" width="32" height="12" transform="translate(12) rotate(90)" fill="lime"/>
            </g>
            <circle id="Ellipse_1" data-name="Ellipse 1" cx="10" cy="10" r="10" transform="translate(141 141)"/>
          </g>
        </svg>
    </div>
    
    <div style="margin-left: 10px;">
        <div>南北放行时长：{{snClearanceDuration}}</div>
        <div>东西放行时长：{{ewClearanceDuration}}</div>
        <div>剩余时间：{{secondsRemaining}}s</div>
        <div>放行方向：{{clearanceDirectionLabel}}</div>
    </div>
</div>`,

    data() {
        return {
            snClearanceDuration: 10,
            ewClearanceDuration: 10,
            secondsRemaining: 10,
            clearanceDirection: "ew" | "sn"
        };
    },

    mounted() {
        this.light_ew = $("#light_ew rect");
        this.light_sn = $("#light_sn rect");

        this.clearanceEW();
        this.startTimer();
    },

    computed: {
        clearanceDirectionLabel() {
            switch (this.clearanceDirection) {
                case "sn":
                    return "南北";
                case "ew":
                    return "东西";
                default:
                    return "未知";
            }
        }
    },

    methods: {
        clearanceSN() {
            this.light_ew.attr("fill", "red");
            this.light_sn.attr("fill", "lime");

            this.secondsRemaining = this.snClearanceDuration;
            this.clearanceDirection = "sn";
        },

        clearanceEW() {
            this.light_ew.attr("fill", "lime");
            this.light_sn.attr("fill", "red");

            this.secondsRemaining = this.ewClearanceDuration;
            this.clearanceDirection = "ew";
        },

        startTimer() {
            setInterval(() => {
                this.secondsRemaining--;
                if (this.secondsRemaining <= 0) {
                    switch (this.clearanceDirection) {
                        case "ew":
                            this.clearanceSN();
                            break;
                        case "sn":
                            this.clearanceEW();
                            break;
                        default:
                            //TODO
                            break
                    }
                }
            }, 1000);
        }
    }
});