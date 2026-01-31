const emptyFunc = (...args: any[]) => {};

const logger = (...args: any[]) => { console.log(...args); };
const isSilent = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test" || !!process.env.JEST_WORKER_ID;

export const log = isSilent ? emptyFunc : logger;

export function logFactory (prefix: string) {
    return function (...args: any[]) {
        log(prefix, ...args);
    };
}
