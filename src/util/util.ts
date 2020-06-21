export function parameterHash (args: any[]) {
    return args.map(e => {
        if (typeof e === "number") {
            return e.toString();
        }
        else if (typeof e === "string") {
            return e;
        }
        else if (typeof e.toString === "function") {
            return e.toString();
        }
        else {
            return JSON.stringify(e);
        }
    }).reduce((accumulator, currentValue) => accumulator + currentValue);
}
