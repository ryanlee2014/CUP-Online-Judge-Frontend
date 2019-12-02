const emptyFunc = (...args: any[]) => {};

const logger = (...args: any[]) => { console.log(...args); };

export const log = process.env.NODE_ENV === "production" ? emptyFunc : logger;

export function logFactory (prefix: string) {
    return function (...args: any[]) {
        log(prefix, ...args);
    };
}
