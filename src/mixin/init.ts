import Vue, { defineComponent } from "vue";
import { Component } from "vue-property-decorator";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import popup from "semantic-ui-popup";
import util from "../lib/util";
import $ from "jquery";
import { darkModeMixin } from "@/mixin/DarkModeMixin";
const Clipboard = require("clipboard");

/**
 * Options-API mixin (Vue 3 compatible). Class components keep using the default export below.
 */
export const initMixin = defineComponent({
    mixins: [darkModeMixin],
    mounted () {
        util.init(this.$store.getters.homepage);
        document.title = this.$t("oj-name") as string;
        this.bindCopyTrigger();
    },
    methods: {
        bindCopyTrigger (): void {
            const copyContent = new Clipboard(".copy", {
                text (trigger: any) {
                    return $(trigger).parent().next().text().trim();
                }
            });
            copyContent.on("success", (e: any) => {
                ($(e.trigger) as any)
                    .popup({
                        title: this.$t("finish") as string,
                        content: this.$t("Context is in your clipboard") as string,
                        on: "click"
                    })
                    .popup("show");
            });
        }
    }
});

@Component({ mixins: [initMixin] })
export default class InitMixin extends Vue {
    renderDarkMode!: () => void;
    bindCopyTrigger!: () => void;
}
