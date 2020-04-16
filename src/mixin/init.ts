import Vue from "vue";
import { Component } from "vue-property-decorator";
import popup from "semantic-ui-popup";
import util from "../lib/util";
import config from "../../config/environment.json";
import $ from "jquery";
const Clipboard = require("clipboard");

@Component
export default class InitMixin extends Vue {
    customConfig = config;
    mounted () {
        util.init(this.$store.getters.homepage);
        document.title = config.title;
        this.bindCopyTrigger();
    }

    bindCopyTrigger () {
        const copyContent = new Clipboard(".copy", {
            text (trigger: any) {
                return $(trigger).parent().next().text().trim();
            }
        });
        copyContent.on("success", (e: any) => {
            $(e.trigger)
                .popup({
                    title: this.$t("finish") as string,
                    content: this.$t("Context is in your clipboard") as string,
                    on: "click"
                })
                .popup("show");
        });
    }
}
