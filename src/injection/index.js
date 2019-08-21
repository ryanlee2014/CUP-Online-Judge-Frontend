import Middleware from "../module/Middleware/core";
import axios from "axios";

export default function () {
    // eslint-disable-next-line no-extend-native
    Function.prototype.before = function (beforefn) {
        const __self = this;
        return function () {
            beforefn.apply(this, arguments);
            return __self.apply(this, arguments);
        };
    };
    // eslint-disable-next-line no-extend-native
    Function.prototype.after = Function.prototype.then = function (afterfn) {
        const __self = this;
        return function () {
            const ret = __self.apply(this, arguments);
            afterfn.apply(this, arguments);
            return ret;
        };
    };

    const _get = axios.get;
    const _post = axios.post;
    axios.get = function () {
        return _get.apply(this, arguments).catch(reason => {
            console.log("GET ERROR: ", reason);
        });
    };

    axios.post = function () {
        return _post.apply(this, arguments).catch(reason => {
            console.log("POST ERROR: ", reason);
        });
    };
}
