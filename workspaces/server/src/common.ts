import { Primitive } from 'utility-types'

export const flattenProjection = (objOrPrimitive: object | Primitive | null): string[] => {
    if(objOrPrimitive === null) return []
    if(typeof objOrPrimitive !== 'object') return []

    const keys: string[] = []
    for(const [key, value] of Object.entries(objOrPrimitive)) {
        const subkeys = flattenProjection(value as object | Primitive | null)
        keys.push(key, ...subkeys.map((subkey) => `${key}.${String(subkey)}`))
    }

    return keys
}
