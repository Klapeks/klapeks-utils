

export type PrefixedKeys<T, P extends string> = {
    [K in keyof T as K extends string ? `${P}${K}` : never]: T[K]
}

// export type ComplexObjectToSingleEntity<T, P extends string = ''> = {
//     [K in keyof T as (
//         K extends string ? (
//             T[K] extends object ? (
//                 `${P}_${K}`
//             ) : K
//         ) : never
//     )]: T[K]
// }


export type Entry = { key: string, value: any, optional: boolean };
export type Explode<T, Splitter extends string = '.'> =
    T extends object ? { [K in keyof T]-?:
        K extends string ? Explode<T[K], Splitter> extends infer E ? E extends Entry ?
        {
            key: `${K}${E['key'] extends "" ? "" : Splitter}${E['key']}`,
            value: E['value'],
            optional: E['key'] extends "" ? {} extends Pick<T, K> ? true : false : E['optional']
        }
        : never : never : never
    }[keyof T] : { key: "", value: T, optional: false }

export type Collapse<T extends Entry> = (
    { [E in Extract<T, { optional: false }> as E['key']]: E['value'] }
    & Partial<{ [E in Extract<T, { optional: true }> as E['key']]: E['value'] }>
) extends infer O ? { [K in keyof O]: O[K] } : never

export type Flatten<T, Splitter extends string = '.'> = Collapse<Explode<T, Splitter>>;

export function obejctToFlat<
    T extends object, 
    Splitter extends string, 
    P = Flatten<T, Splitter>
>(
    object: T, 
    splitter: Splitter
): P {
    let newObject: any = {};
    for (let key of Object.keys(object)) {
        if (!(object as any)[key]) {
            (object as any)[key] = null;
            continue;
        }
        if (typeof (object as any)[key] == 'object') {
            (object as any)[key] = obejctToFlat((object as any)[key], splitter);
            for (let subkey of Object.keys((object as any)[key])) {
                newObject[key + splitter + subkey] = (object as any)[key][subkey];
            }
            continue;
        }
        newObject[key] = (object as any)[key]; 
    }
    return newObject;
}