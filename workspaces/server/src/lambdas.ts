import { DB_NAME, DB_URL, IBlueprint, RequiredSome } from '@sepraisal/common'
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import { MongoClient, RootQuerySelector } from 'mongodb'

import { track } from './common'


export const hello: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {

    track(event)

    try {
        const params = event.queryStringParameters ? event.queryStringParameters : {}

        const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true })

        const find: RequiredSome<RootQuerySelector<IBlueprint>, '$and'> = 'find' in params ? JSON.parse(params.find) : {}
        const skip: number = 'skip' in params ? JSON.parse(params.skip) : 0
        const sort: Record<string, string> = 'sort' in params ? JSON.parse(params.sort) : {}
        const projection: Record<string, string> = 'projection' in params ? JSON.parse(params.projection) : {}
        const limitRaw: number = 'limit' in params ? JSON.parse(params.limit) : 100

        // MongoDB wants Date objects instead of strings, so replace some known ones.
        for(const criterion of find.$and) {
            const key = Object.keys(criterion).pop()
            if(key === 'steam.postedDate' || key === 'steam.updatedDate') {
                const subkeys = Object.keys(criterion[key])  // $gte, $lte, $eq, and the like.
                for(const subkey of subkeys) {
                    criterion[key][subkey] = new Date(criterion[key][subkey])
                }
            }
        }

        const limit = Math.max(0, Math.min(100, limitRaw))

        const cursor = client
            .db(DB_NAME)
            .collection<IBlueprint>('blueprints')
            .find(find)
            .sort(sort)
            .project(projection)
            .skip(skip)
            .limit(limit)

        const result = {
            count: await cursor.count(),
            docs: await cursor.toArray(),
            find,
            limit,
            projection,
            skip,
            sort,
        }

        await client.close()

        return {
            body: JSON.stringify(result),
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
        }
    } catch(err) {
        const error = err instanceof Error ? err : new Error(err as string)
        console.error(error.stack)

        return {
            body: error.message,
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 503,
        }
    }
}
