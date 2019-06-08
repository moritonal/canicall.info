<template>
    <div id="background" v-bind:class="{redBackground : isRed, greenBackground: isGreen, blankBackground: isLocationSet}">
        <div class="container">

            <transition name="expand" v-on:after-leave="afterLeave">
                <div class="outputContainer" v-show="isLocationSet" key="yesno">
                    <div class="timezone">
                        <span>{{cleanTimeZone}} </span><span>-</span> <span>{{cleanTime}}</span>
                    </div>
                    <div class="canCall">
                        <span>{{canCall}}</span>
                    </div>
                </div>
            </transition>

            <div class="inputContainer" v-bind:class="{ subbed: isLocationSet }">
                <div>Where are they?</div>
                <input v-model="location" placeholder="City">
            </div>

            <div class="credits">
                <span>Made with 💛 by <a href="https://bonner.is">Tom</a>.</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import debounce from "debounce"

// import Vue from "vue"
// import { Component, Watch } from "vue-class-component"
import { Vue, Component, Watch } from 'vue-property-decorator'
import moment from "moment"
import "moment-timezone"

@Component({

})
export default class App extends Vue {
        
    location : string = ""
    awesome: boolean = false

    data() {
        return {
            get timeZone() {
                return Vue.localStorage.get('timeZone');
            },
            set timeZone(newValueue) {

                if (newValueue == undefined || newValueue == null) {
                    Vue.localStorage.remove("timeZone")
                } else {
                    Vue.localStorage.set('timeZone', newValueue);
                }
            }
        }
    }

    get storedLocation() {
        return Vue.localStorage.get('location');                
    };

    set storedLocation(newValueue) {
        if (newValueue == undefined || newValueue == null) {
            Vue.localStorage.remove("location");
        } else {
            Vue.localStorage.set('location', newValueue);
        }
    };
    
    created() {
        let storedLocation = this.storedLocation;

        console.log(`Stored location is \"${storedLocation}\"`)
        if (storedLocation !== null ) {
            this.location = storedLocation;
        }

        this.handleLocationChanged = debounce(this.handleLocationChanged, 500).bind(this);
    };

    localStorage: {

    };

    canCallBool() {
        if (!this.timeZone)
            return null;

        let timeZonedMoment = moment().tz(this.timeZone);

        let hour = parseInt(timeZonedMoment.format("HH"));

        return hour > 8 && hour < 22
    };

    afterLeave() {
        console.log("Setting timezone to null");
        this.timeZone = null;
    };

    get isLocationSet() {
        return this.location && this.timeZone && this.timeZone !== "undefined"
    };

    get cleanTime() {
        if (!this.timeZone || this.timeZone === "undefined")
            return "";

        return moment().tz(this.timeZone).format("hh:mm A");
    };

    get cleanTimeZone() {
        if (!this.timeZone || this.timeZone === "undefined")
            return "";

        return this.timeZone.replace(/_/g, " ").replace(/^(.*)\//g, "");
    };

    get isRed() {
        return this.isLocationSet && !this.canCallBool()
    };

    get isGreen() {
        return this.isLocationSet && this.canCallBool()
    };

    get canCall() {

        if (!this.timeZone || this.timeZone === "undefined")
            return "";

        let pre = this.awesome ? "Love you, and " : "";

        let timeZonedMoment = moment().tz(this.timeZone);

        let hour = parseInt(timeZonedMoment.format("HH"));

        console.log(`Current hour: ${hour}`)

        return pre + (hour > 8 && hour < 22 ? "Yes" : "No");
    }

    @Watch("location")
    async onLocationChanged(newValue) {
        this.handleLocationChanged(newValue);
    }

    async handleLocationChanged(newValue) {

        console.log(newValue);

        if (newValue === "" || newValue === null) {
            this.location = null;
            this.storedLocation = null;
            return;
        }

        if (newValue.toLowerCase().includes("tish")) {
            this.awesome = true;
            this.timeZone = "America/Los_Angeles"
            return;
        }
        if (newValue.toLowerCase().includes("tom")) {
            this.awesome = true;
            this.timeZone = "Europe/London"
            return;
        }

        async function getLocation(location) {
            let api = "AIzaSyCTUPfOuS9K9QzN_zYpek-ElQAsqL8DphU";

            console.log(`Searching for ${newValue}`);

            let target = `https://maps.googleapis.com/maps/api/geocode/json?address=${newValue}&key=${api}`;

            try {
                let res = await fetch(target);

                let body = await res.json();

                let latLong = body.results[0].geometry.location;

                return latLong;
            } catch (ex) {
                return null;
            }
        }

        async function getTimeZone(lat, long) {

            let api = "AIzaSyBERYGXmLyHhAeAcmBwTRsgnezCwQ30JpA";

            let timestamp = new Date().getTime() / 1000;

            let target = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${long}&timestamp=${timestamp}&key=${api}`

            let res = await fetch(target);

            let body = await res.json();

            return body.timeZoneId;
        }

        let latLong = await getLocation(newValue);

        if (latLong === null)
            return;

        let timeZone = await getTimeZone(latLong.lat, latLong.lng);

        this.timeZone = timeZone;
        this.storedLocation = newValue;

        console.log(`Timezone set to ${timeZone}`);

        let timeZonedMoment = moment().tz(timeZone);

        console.log(`Current hour: ${timeZonedMoment.format("HH")}`)
    }
}

</script>

<style lang="scss">


</style>