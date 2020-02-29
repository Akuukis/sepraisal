import { APIGatewayProxyEvent } from 'aws-lambda'
import { Primitive } from 'utility-types'

const MATOMO_PARAMS = {
    // TODO: Do not hardcode this.
    siteId: Number(process.env.MATAMO_SITE_ID!),
    url: process.env.MATAMO_URL!,
} as const

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

export const track = async (event: APIGatewayProxyEvent) => {
    const params = [
        `apiv=1`,
        `rec=1`,
        `idsite=${MATOMO_PARAMS.siteId}`,
        `action_name=Server`,
        `url=db.spaceengineerspraisal.net`,
        // `_id=${event.pathParameters?.pk_vid ?? hash}`,
        `rand=${Math.random()}`,
    ]

    // if('Origin' in event.headers) params.push(`???=${event.headers.Origin}`)
    if('Referrer' in event.headers) params.push(`urlref=${event.headers.Referrer}`)
    if('User-Agent' in event.headers) params.push(`ua=${event.headers['User-Agent']}`)
    if('Accept-Language' in event.headers) params.push(`ua=${event.headers['Accept-Language']}`)

    return fetch(`https:${MATOMO_PARAMS.url}?${params.join('&')}`)
}
