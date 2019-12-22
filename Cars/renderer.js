window.Vue = require("vue/dist/vue");
const MainApp = require("./src/controllers/MainApp.js");

let root = document.createElement("div");
document.body.appendChild(root);

new MainApp().$mount(root);
