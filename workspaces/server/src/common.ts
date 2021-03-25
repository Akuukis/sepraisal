import { APIGatewayProxyEvent } from 'aws-lambda'
import fetch, { Response } from 'node-fetch'

const MATOMO_PARAMS = {
    siteId: Number(process.env.MATAMO_SITE_ID!),  /* eslint-disable-line @typescript-eslint/no-non-null-assertion */  // dotenv asserts it.
    url: process.env.MATAMO_URL!,  /* eslint-disable-line @typescript-eslint/no-non-null-assertion */  // dotenv asserts it.
} as const

export const track = async (event: APIGatewayProxyEvent): Promise<Response | null> => {
    const {find, pk_vid} = event.queryStringParameters ?? {}

    if(MATOMO_PARAMS.url && MATOMO_PARAMS.siteId) {
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

    console.info(
        event.headers['user-agent'],
        '|',
        event.headers.referrer,
        '|',
        JSON.stringify(find),
    )
    return null
}
