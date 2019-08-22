import util from "../lib/util";
import config from "../../config/environment";
const $ = require("jquery");
window.$ = window.jQuery = $;
export default {
    mounted () {
        util.init(this.$store.getters.homepage);
        document.title = config.title;
    }
};
