


export function reactive<T extends object>(object: T, callback: (key: string, newValue: any) => any) {
    let _b = false;
    function handler(preKey = ''): ProxyHandler<any> {
        function recursiveProxy(key: string, object: any) {
            for (let key2 of Object.keys(object)) {
                if (!object[key2] || typeof object[key2] != 'object') continue;
                // logger.log("make recursive proxy", key+'.'+key2)
                object[key2] = recursiveProxy(key+'.'+key2, object[key2]);
            }
            return new Proxy(object, handler(key));
        }
        return {
            get(target: any, key: string) {
                return target[key];
            },
            set(target: any, key: any, value: any) {
                const pk = preKey ? (preKey+'.'+key) : key;
                // console.log('ppkkk key', pk);
                if (typeof value == 'object' && value !== null) {
                    value = recursiveProxy(pk, value);
                }
                if (_b && target[key] != value) callback(pk, value)
                target[key] = value;
                return true;
            },
        };
    }

    const proxyObject = new Proxy<T>(object, handler());
    for (let key of Object.keys(proxyObject)) {
        (proxyObject as any)[key] = (proxyObject as any)[key];
    }
    _b = true;
    return proxyObject;
}