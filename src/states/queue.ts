import { logger } from "../utils/logs";


export class Queue {
    
    private queue: (() => any)[] = [];
    constructor() {}

    private _isWorking = false;
    get isWorking() {
        return this._isWorking;
    }

    private async start() {
        if (this._isWorking) return;
        this._isWorking = true;
        while (this.queue.length) {
            let func = this.queue.shift() as any;;
            if (!func) continue;
            try {
                func = func();
                if (!func) continue;
                if ('then' in func) {
                    await func;
                }
            } catch (err) {
                logger.error("Queue uncaught err:", err);
            }
        }
        this._isWorking = false;
    }
    push(func: () => any) {
        this.queue.push(func);
        this.start();
    }

    async run<T>(func: () => T | Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.push(async () => {
                try {
                    func = func() as any;
                    if (func && 'then' in func) {
                        func = await (func as any);
                    }
                    resolve(func as any);
                } catch(error) {
                    reject(error);
                }
            });
        })
    }
}