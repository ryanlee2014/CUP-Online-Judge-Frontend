import util from "../lib/util"
const $ = require("jquery");
require("../static/js/semantic.min");
window.$ = window.jQuery = $;
export default {
    mounted() {
        util.init();
    }
}
