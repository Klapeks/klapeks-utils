import { Queue } from "./queue";




export class KeyedQueue {

    private _queues = new Map<string, Queue>();
    constructor() {}

    getQueue(key: string): Queue {
        if (!this._queues.has(key)) {
            this._queues.set(key, new Queue());
        }
        return this._queues.get(key)!;
    }

    async run<T>(key: string, func: () => T | Promise<T>): Promise<T> {
        return this.getQueue(key).run(func);
    }

    push(key: string, func: () => any) {
        this.getQueue(key).push(func);
    }
}