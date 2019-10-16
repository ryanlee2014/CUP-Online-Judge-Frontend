import util from "../lib/util";
import config from "../../config/environment";

export default {
    mounted () {
        util.init(this.$store.getters.homepage);
        document.title = config.title;
    }
};
