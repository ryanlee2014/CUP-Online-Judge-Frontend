class Middleware {
    private cache: any[];
    private options: any;
    private middlewares: any[];
    constructor () {
        this.cache = [];
        this.options = null;
        this.middlewares = [];
    }

    use (fn: (...arg: any[]) => any) {
        if (typeof fn !== "function") {
            console.warn("Middleware.use should push function");
            return this;
        }
        this.cache.push(fn);
        return this;
    }

    next (fn?: (...arg: any[]) => any) {
        if (this.middlewares && this.middlewares.length > 0) {
            const ware = this.middlewares.shift();
            ware.call(this, this.options, this.next.bind(this));
        }
    }

    commit (options?: any) {
        this.middlewares = this.cache.map(el => el);
        this.options = options;
        this.next();
    }
}

export default Middleware;
