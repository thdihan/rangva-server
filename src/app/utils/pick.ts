export const pick = <Q extends Record<string, unknown>, T extends keyof Q>(
    obj: Q,
    keys: T[]
): Partial<Q> => {
    const finalObj: Partial<Q> = {};

    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    }

    return finalObj;
};
