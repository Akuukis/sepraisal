import { APIGatewayProxyEvent } from 'aws-lambda'
import fetch, { Response } from 'node-fetch'
import { Primitive } from 'utility-types'

const MATOMO_PARAMS = {
    siteId: Number(process.env.MATAMO_SITE_ID!),  /* eslint-disable-line @typescript-eslint/no-non-null-assertion */  // dotenv asserts it.
    url: process.env.MATAMO_URL!,  /* eslint-disable-line @typescript-eslint/no-non-null-assertion */  // dotenv asserts it.
} as const

export const flattenProjection = (objOrPrimitive: Record<string, unknown> | Primitive | null): string[] => {
    if(objOrPrimitive === null) return []
    if(typeof objOrPrimitive !== 'object') return []

    const keys: string[] = []
    for(const [key, value] of Object.entries(objOrPrimitive)) {
        const subkeys = flattenProjection(value as Record<string, unknown> | Primitive | null)
        keys.push(key, ...subkeys.map((subkey) => `${key}.${String(subkey)}`))
    }

    return keys
}

export const track = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const {find, pk_vid} = event.queryStringParameters ?? {}
    const params = [
        `apiv=1`,
        `rec=1`,
        `idsite=${MATOMO_PARAMS.siteId}`,
        `e_c=api`,
        `e_a=querry`,
        `e_n=${encodeURIComponent(find)}`,
        pk_vid ? `_id=${pk_vid}` : undefined,
        `rand=${Math.random()}`,
    ].filter((part)=>part !== undefined)

    // if('Origin' in event.headers) params.push(`???=${event.headers.Origin}`)
    if('referrer' in event.headers) params.push(`urlref=${encodeURIComponent(event.headers.referrer)}`)
    if('user-agent' in event.headers) params.push(`ua=${encodeURIComponent(event.headers['user-agent'])}`)
    if('accept-language' in event.headers) params.push(`ua=${encodeURIComponent(event.headers['accept-language'])}`)

    return fetch(`https:${MATOMO_PARAMS.url}/matomo.php?${params.join('&')}`)
}
