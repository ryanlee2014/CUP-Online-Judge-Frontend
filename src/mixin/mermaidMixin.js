import mermaid from "mermaid";
const $ = require("jquery");
export default {
    created () {
        $(document).on("click", function () {
            $(".mermaid").each(function (el, v) {
                if ($(v).is(":visible")) {
                    mermaid.init(undefined, v);
                }
            });
        });
    }
};
