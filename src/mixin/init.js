import util from "../lib/util"
import config from '../../config/environment'
const $ = require("jquery");
window.$ = window.jQuery = $;
require("../static/js/semantic.min");
export default {
    mounted() {
        util.init();
        document.title = config.title;
    }
}
