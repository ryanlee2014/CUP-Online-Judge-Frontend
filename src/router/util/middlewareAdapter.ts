const nextFunctionError = new Error("Last argument must be a function");
const argumentNotFunctionError = new Error("arguments must be function");
export default class MiddlewareAdapter {
    _next: any;
    _middlewares: any = [];
    _from: any;
    _to: any;

    constructor () {
        this._next = null;
        this._from = null;
        this._to = null;
    }

    setNext (fn: (...arg: any[]) => any) {
        if (typeof fn === "function") {
            this._next = fn;
        }
        else {
            throw nextFunctionError;
        }
    }

    getNextFn () {
        return (config: any) => this.next(config);
    }

    next (config: any) {
        const _next = this._next;
        const _middlewares = this._middlewares;
        const _to = this._to;
        const _from = this._from;
        const length = this._middlewares.length;
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
    }

    setFrom (config: any) {
        this._from = config;
    }

    add (...argument:any[]) {
        for (let i of arguments) {
            if (typeof i !== "function") {
                throw argumentNotFunctionError;
            }
            this._middlewares.push(i);
        }
    }

    setTo (config: any) {
        this._to = config;
    }
}
