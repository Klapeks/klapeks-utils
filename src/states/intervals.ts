import { logger } from "../utils";

export interface IAsyncInterval {
    timer: number;
    inverval: number;
    callback: () => Promise<any>;
}

let asyncIntervals = [] as IAsyncInterval[];
const INTERVAL_MS = 50;

setInterval(() => {
    for (let interval of asyncIntervals) {
        // if -1 -> skip
        if (interval.timer < 0) continue;
        interval.timer -= INTERVAL_MS;
        // if more than 0 -> skip
        // else if 0 or less -> call function
        if (interval.timer > 0) continue;
        interval.timer = -1;
        try {
            interval.callback().finally(() => {
                interval.timer = interval.inverval;
            });
        } catch (err) {
            logger.error('errow while intervaling', err);
        }
    }
}, INTERVAL_MS);


export function clearAsyncIntervals(intervals: IAsyncInterval[]) {
    if (!intervals?.length) return;
    asyncIntervals = asyncIntervals.filter(i => !intervals.includes(i));
}
export function clearAsyncInterval(interval: IAsyncInterval | (() => Promise<any>)) {
    if ('apply' in interval) {
        asyncIntervals = asyncIntervals.filter(i => i.callback != interval);
        return;
    }
    asyncIntervals = asyncIntervals.filter(i => i != interval);
}
export function setAsyncInterval(callback: () => Promise<any>, ms: number) {
    const interval: IAsyncInterval = { callback, inverval: ms, timer: ms };
    asyncIntervals.push(interval);
    return interval;
}

export class Intervals {

    private _intervals = [] as any[];
    private _asyncIntervals = [] as IAsyncInterval[];
    private _timeouts = undefined as Set<any> | undefined;

    start(callback: () => any, ms: number) {
        this._intervals.push(setInterval(callback, ms));
    }
    startAsync(callback: () => Promise<any>, ms: number) {
        this._asyncIntervals.push(setAsyncInterval(callback, ms));
    }
    setTimeout(callback: () => any, ms: number) {
        if (!this._timeouts) this._timeouts = new Set();
        const timeout = setTimeout(() => {
            this._timeouts?.delete(timeout);
            if (!this._timeouts?.size) {
                this._timeouts = undefined;
            }
            callback();
        }, ms);
        this._timeouts.add(timeout)
    }

    stopAll() {
        this._intervals.forEach(i => clearInterval(i));
        this._intervals = [];
        clearAsyncIntervals(this._asyncIntervals);
        this._asyncIntervals = [];
        if (this._timeouts) {
            this._timeouts.forEach(t => clearTimeout(t));
            this._timeouts = undefined;
        }
    }

}

