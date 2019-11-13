import Middleware from "../module/Middleware/core";
import axios from "axios";

export default function () {
    // eslint-disable-next-line no-extend-native
    // @ts-ignore
    Function.prototype.before = function (beforefn: (...arg: any[]) => any) {
        const __self = this;
        return function (this: any) {
            beforefn.apply(this, <any>arguments);
            return __self.apply(this, arguments);
        };
    };
    // eslint-disable-next-line no-extend-native
    // @ts-ignore
    Function.prototype.after = Function.prototype.then = function (afterfn: (...arg: any[]) => any) {
        const __self = this;
        return function (this: any) {
            const ret = __self.apply(this, arguments);
            afterfn.apply(this, <any>arguments);
            return ret;
        };
    };

    const _get = axios.get;
    const _post = axios.post;
    // @ts-ignore
    axios.get = function () {
        return _get.apply(this, <any>arguments).catch(reason => {
            console.log("GET ERROR: ", reason);
        });
    };

    // @ts-ignore
    axios.post = function () {
        return _post.apply(this, <any>arguments).catch(reason => {
            console.log("POST ERROR: ", reason);
        });
    };
}
