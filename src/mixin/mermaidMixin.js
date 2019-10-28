import mermaid from "mermaid";
const $ = require("jquery");
export default {
    created () {
        const that = this;
        $(document).on("click", function () {
            that.initVisibleMermaid();
        });
    },
    methods: {
        initVisibleMermaid () {
            $(".mermaid").each(function (el, v) {
                if ($(v).is(":visible")) {
                    mermaid.init(undefined, v);
                }
            });
        },
        initMermaid () {
            $(".mermaid").each(function (el, v) {
                mermaid.init(undefined, v);
            });
        }
    }
};
