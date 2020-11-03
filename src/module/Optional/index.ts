import _ from "lodash";

interface IOptional<T> {
    get(): T
}

export class Optional<T> {
    data: T;
    constructor (obj: T) {
        this.data = obj;
    }

    isPresent () {
        return !(this.data === null || this.data === undefined);
    }

    ifPresent (consumer: (value: T) => any) {
        if (this.isPresent()) {
            consumer(this.data);
        }
    }

    public map<R> (mapper: (value: T) => Optional<R>) {
        return new Optional(mapper(this.data));
    }

    public orElse (orValue: T) {
        if (!this.isPresent()) {
            return orValue;
        }
        else {
            return this.data;
        }
    }

    public equals (rightValue: T) {
        if (this.isPresent()) {
            return _.isEqual(this.data, rightValue);
        }
        else {
            return false;
        }
    }

    public filter (predicate: (value: T) => boolean) {
        if (this.isPresent() && predicate(this.data)) {
            return this;
        }
        else {
            return new Optional<T>(null as unknown as any);
        }
    }

    public get () {
        return this.data;
    }
}
