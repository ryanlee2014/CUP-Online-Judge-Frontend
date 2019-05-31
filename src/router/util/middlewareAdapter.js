const nextFunctionError = new Error("Last argument must be a function");
const argumentNotFunctionError = new Error("arguments must be function");
export default function () {
    let _next;
    let _middlewares = [];
    let _from;
    let _to;
    this.setNext = function (fn) {
        if (typeof fn === "function") {
            _next = fn;
        }
        else {
            throw nextFunctionError;
        }
    };

    this.next = function (config) {
        const length = _middlewares.length;
        if (typeof config !== "undefined") {
            if (typeof _next === "undefined") {
                throw new Error("next function has not set");
            }
            _next(config);
        }
        else {
            for (let i = 0; i < length; ++i) {
                if (typeof _middlewares[i] !== "function") {
                    throw argumentNotFunctionError;
                }
                _middlewares[i](_to, _from);
            }
            _next();
        }
    };

    this.setFrom = function (config) {
        _from = config;
    };

    this.add = function () {
        for (let i of arguments) {
            if (typeof i !== "function") {
                throw argumentNotFunctionError;
            }
            _middlewares.push(i);
        }
    };

    this.setTo = function (config) {
        _to = config;
    };
}
