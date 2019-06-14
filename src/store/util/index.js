export function notUndefinedOrNull (el) {
    return typeof el !== "undefined" && el !== null;
}

export function isObject (obj) {
    return typeof obj === "object" && obj !== null;
}
