import logger from './logs';

export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

function sleep(ms: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    });
}
export function assertNever(never: never, error?: any): never {
    logger.error("Never assert failed:", never);
    if (!error) error = new Error("Never assered: " + JSON.stringify(never));
    if (typeof error != 'object') error = new Error(error);
    throw error;
}
export default {
    delay: sleep, sleep, assertNever,
    replaceAll(str: string, from: string, to: string): string {
        while(str.includes(from)) {
            str = str.replace(from, to);
        }
        return str;
    },
    replaceLast(str: string, from: string, to: string): string {
        const lastIndex = str.lastIndexOf(from);
        if (lastIndex < 0) return str;
        return str.substring(0, lastIndex) + to +
                str.substring(lastIndex + from.length);
    },
    /** @return from 0 to max-1 */
    random(max: number) {
        return (Math.random() * max) | 0;
    },
    /** @return from 0 to max */
    randomInclude(max: number) {
        // return Math.round(Math.random() * max); // bad
        return Math.floor(Math.random() * (max+1)); // good
    },
    randomPassword(len?: number) {
        if (!len) len = 10 + (Math.random()*10)|0;
        const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let str = '';
        for (let i = 0; i < len; i++) {
            str += charset[(Math.random() * charset.length)|0];
        }
        return str;
    },
} as const;