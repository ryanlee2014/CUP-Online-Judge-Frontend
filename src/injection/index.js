import Middleware from "../module/Middleware/core";

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
}
