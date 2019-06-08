import Vue from "vue"
import VueLocalStorage from "vue-localstorage"

let app = null;

import 'babel-polyfill';
import App from "./../vue/App.vue";

function main() {

    Vue.use(VueLocalStorage);

    new Vue({
        el: '#app',
        render: h => h(App)
    });
}

window.onfocus = () => {
    if (app) {
        app.timeZone = app.timeZone;
    }
};

if (typeof document.addEventListener === "undefined" || typeof document.hidden === "undefined") {

} 
else
{
    document.addEventListener("visibilitychange", ()=>{
        if (app) {
            app.timeZone = app.timeZone;
        }
    }, false);
}     
    

document.addEventListener("DOMContentLoaded", (event) => {
    main();
});