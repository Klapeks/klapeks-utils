

export function unreactiveImmutableDelete<T>(
    array: T[], filterPredicate: (element: T) => boolean
): T[] {
    array = JSON.parse(JSON.stringify(array));
    return array.filter(filterPredicate);
}

export function unreactiveObject<T>(element: T): T {
    if (!element) return element;
    return JSON.parse(JSON.stringify(element));
}


export const objectUtils = {
    unreactiveImmutableDelete<T>(
        array: T[], filterPredicate: (element: T) => boolean
    ): T[] {
        array = JSON.parse(JSON.stringify(array));
        return array.filter(filterPredicate);
    },
    unreactiveObject<T>(element: T): T {
        if (!element) return element;
        return JSON.parse(JSON.stringify(element));
    },

    /** Recursively merges values from 'objectCopyFrom' to 'objectCopyTo' */
    mergeObjects(objectCopyTo: any, objectCopyFrom: any) {
        let canMerge = false;
        for (let key of Object.keys(objectCopyFrom)) {
            canMerge = objectCopyFrom[key] && typeof objectCopyFrom[key] === 'object';
            if (canMerge && Array.isArray(objectCopyFrom[key])) canMerge = false;
            if (canMerge) {
                if (!objectCopyTo[key]) objectCopyTo[key] = objectCopyFrom[key];
                else objectUtils.mergeObjects(objectCopyTo[key], objectCopyFrom[key]);
                continue;
            }
            objectCopyTo[key] = objectCopyFrom[key];
        }
    },

    /** cuts string field in object to maxLength and adds continue symbol '…' */
    cutStringField<T extends object>(
       object: T, 
       key: keyof T, 
       maxLength: number, 
       addSymbols?: string
    ): void {
        if (!object?.[key]) return;
        if (typeof object[key] != 'string') return;
        if (((object as any)[key] as string).length <= maxLength) return;
        if (!addSymbols && addSymbols !== '') addSymbols = '…';
        (object as any)[key] = ((object as any)[key] as string)
            .substring(0, maxLength - addSymbols.length - 1) + addSymbols;
    },

    /** Recursively removes null, undefined, empty strings, NaN from object */
    removeNullsFromObject<T extends object>(object: T): T {
        if (!object) return object;
        if (object instanceof Date) return object;
        for (let key of Object.keys(object)) {
            if ((object as any)[key] === null 
            || (object as any)[key] === undefined
            || (object as any)[key] === '') {
                delete (object as any)[key];
            }
            if (typeof (object as any)[key] === 'number' 
            && Number.isNaN((object as any)[key])) {
                delete (object as any)[key];
            }
            if ((object as any)[key] && typeof (object as any)[key] === 'object') {
                (object as any)[key] = objectUtils.removeNullsFromObject((object as any)[key]);
            }
        }
        return object;
    },

    /** Removes undefined values from object */
    removeUndefineds<T extends object>(object: T, deep = false): T {
        for (let key of Object.keys(object)) {
            if ((object as any)[key] === undefined) {
                delete (object as any)[key];
            }
            else if (typeof (object as any)[key] === 'undefined') {
                delete (object as any)[key];
            }
            else if (deep && typeof (object as any)[key] == 'object') {
                (object as any)[key] = objectUtils.removeUndefineds((object as any)[key], true);
            }
        }
        return object;
    },

    /** Clone object but only with specified keys */
    copyFilteredKeys<T>(object: Partial<T>, keys: (keyof T)[]): Partial<T> {
        const obj: Partial<T> = {};
        for (let key of keys) {
            if (object[key] === undefined) continue;
            if (typeof object[key] == 'undefined') continue;
            obj[key] = object[key];
        }
        return obj;
    },
}