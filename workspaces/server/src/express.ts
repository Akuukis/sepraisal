import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import cors from 'cors'
import express from 'express'

import { hello } from './lambdas'

const app = express()
app.use(cors({credentials: true, origin: true}))

// The HelloWorld
app.get('/', (req, res) => {
    res.send('Space Engineers Praisal database API.')
})

app.get('/hello', (req, res) => {
    (async () => {
        // tslint:disable: id-length no-any no-unsafe-any
        const awsRequest: APIGatewayProxyEvent = {
            body: req.body,
            headers: req.headers as Record<string, string>,
            httpMethod: req.method,
            isBase64Encoded: false,
            multiValueHeaders: {}, // req.headers,
            multiValueQueryStringParameters: req.query,
            path: req.path,
            pathParameters: req.params,
            queryStringParameters: req.query,
            requestContext: null as never,
            resource: null as never,
            stageVariables: null,
        }
        const result = await hello(awsRequest, null as never, null as never) as APIGatewayProxyResult
        // tslint:enable: id-length no-any no-unsafe-any
        if(result.headers) {
            Object.entries(result.headers).forEach(([key, value]) => res.setHeader(key, value as string | number))
        }

        res
            .status(result.statusCode)
            .json(JSON.parse(result.body))
    })().catch((err: Error) => {
        res.status(501).send(`${err.name}: ${err.message}`)
    })
})


const port = 'PORT' in process.env ? Number(process.env.PORT) : 3000

app.listen(port, () => {
    console.info(`App listening on http://localhost:${port}`)
})
