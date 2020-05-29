import Middleware from "../module/Middleware/core";
import axios from "axios";

export default function () {
    // eslint-disable-next-line no-extend-native
    // @ts-ignore
    Function.prototype.before = function (beforefn: (...arg: any[]) => any) {
        const __self = this;
        return function (this: any) {
            // eslint-disable-next-line prefer-rest-params
            beforefn.apply(this, <any>arguments);
            // eslint-disable-next-line prefer-rest-params
            return __self.apply(this, arguments);
        };
    };
    // eslint-disable-next-line no-extend-native
    // @ts-ignore
    Function.prototype.after = Function.prototype.then = function (afterfn: (...arg: any[]) => any) {
        const __self = this;
        return function (this: any) {
            // eslint-disable-next-line prefer-rest-params
            const ret = __self.apply(this, arguments);
            // eslint-disable-next-line prefer-rest-params
            afterfn.apply(this, <any>arguments);
            return ret;
        };
    };

    const _get = axios.get;
    const _post = axios.post;
    // @ts-ignore
    axios.get = function () {
        // eslint-disable-next-line prefer-rest-params
        return _get.apply(this, <any>arguments).catch(reason => {
            if (axios.isCancel(reason)) {
                return;
            }
            console.log("GET ERROR: ", reason);
            return Promise.reject(reason);
        });
    };

    // @ts-ignore
    axios.post = function () {
        // eslint-disable-next-line prefer-rest-params
        return _post.apply(this, <any>arguments).catch(reason => {
            console.log("POST ERROR: ", reason);
            return Promise.reject(reason);
        });
    };
}
