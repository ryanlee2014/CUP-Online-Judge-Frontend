function Middleware () {
    this.cache = [];
    this.options = null;
}

Middleware.prototype.use = function (fn) {
    if (typeof fn !== "function") {
        console.warn("Middleware.use should push function");
        return this;
    }
    this.cache.push(fn);
    return this;
};

Middleware.prototype.next = function (fn) {
    if (this.middlewares && this.middlewares.length > 0) {
        const ware = this.middlewares.shift();
        ware.call(this, this.options, this.next.bind(this));
    }
};

Middleware.prototype.commit = function (options) {
    this.middlewares = this.cache.map(el => el);
    this.options = options;
    this.next();
};

export default Middleware;
