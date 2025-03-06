
export function mapOf<
    T extends object, K extends keyof T
>(objects: T[], key: K): Map<T[K], T> {
    const map = new Map<T[K], T>();
    for (let object of objects) {
        map.set(object[key], object);
    }
    return map;
}

export function joinOneToMany<One, Many, Key extends string>(
    objects: One[], 
    objectIdField: keyof One,
    toBeJoined: Many[], 
    relationKey: keyof Many,
    joinInto: Key,
): (One & {[k in Key]: Many[]})[] {
    let map = new Map<any, Many[]>();
    for (let j of toBeJoined) {
        if (map.has(j[relationKey])) {
            map.get(j[relationKey])!.push(j);
        } else {
            map.set(j[relationKey], [j]);
        }
    }
    for (let t of objects) {
        (t as any)[joinInto] = map.get(t[objectIdField]);
    }
    return objects as any;
}

export function joinManyToOne<
    Many extends object, 
    One extends object,
    Key extends string
>(
    objects: Many[],
    relationKey: keyof Many,
    toBeJoined: One[], 
    toBeJoinedObjectId: keyof One,
    joinInto: Key,
): (Many & {[k in Key]?: One | null})[] {
    let toBeJoinedMap = mapOf(toBeJoined, toBeJoinedObjectId);
    for (let object of objects) {
        (object as any)[joinInto] = toBeJoinedMap.get(object[relationKey] as any);
    }
    return objects as any;
}