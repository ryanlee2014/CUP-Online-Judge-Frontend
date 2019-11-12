export function notUndefinedOrNull (el: any) {
    return typeof el !== "undefined" && el !== null;
}

export function isObject (obj: any) {
    return typeof obj === "object" && obj !== null;
}
