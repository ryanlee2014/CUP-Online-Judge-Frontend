import Vue from "vue";
import mermaid from "mermaid";
import $ from "jquery";
import { Component } from "vue-property-decorator";
@Component
export default class MermaidMixin extends Vue {
    created () {
        const that = this;
        $(document).on("click", function () {
            that.initVisibleMermaid();
        });
    }

    initVisibleMermaid () {
        $(".mermaid").each(function (el: any, v: any) {
            if ($(v).is(":visible")) {
                mermaid.init(v);
            }
        });
    }
    initMermaid () {
        $(".mermaid").each(function (el: any, v: any) {
            mermaid.init(v);
        });
    }
}
