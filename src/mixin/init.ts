import Vue from "vue";
import Component from "vue-class-component";
import util from "../lib/util";
import config from "../../config/environment.json";

@Component
export default class InitMixin extends Vue {
    mounted () {
        util.init(this.$store.getters.homepage);
        document.title = config.title;
    }
}
