import util from "../lib/util"
const $ = require("jquery");
window.$ = window.jQuery = $;
require("../static/js/semantic.min");
export default {
    mounted() {
        util.init();
    }
}
