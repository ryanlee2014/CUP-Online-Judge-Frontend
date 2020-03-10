import Vue from "vue";
import { Component } from "vue-property-decorator";

import util from "../lib/util";
import config from "../../config/environment.json";

@Component
export default class InitMixin extends Vue {
    customConfig = config;
    mounted () {
        util.init(this.$store.getters.homepage);
        document.title = config.title;
    }
}
