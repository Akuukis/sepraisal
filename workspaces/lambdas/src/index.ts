import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as express from 'express'

import { hello } from './handler'

const app = express()

// The HelloWorld
app.get('/', (req, res) => {
  res.send('Space Engineers Praisal database API.')
})

app.get('/hello', (req, res) => {
    (async () => {
        // tslint:disable: id-length no-any no-unsafe-any
        const awsRequest: APIGatewayProxyEvent = {
            body: req.body,
            headers: req.headers as any,
            httpMethod: req.method,
            isBase64Encoded: false,
            multiValueHeaders: req.headers as any,
            multiValueQueryStringParameters: req.query,
            path: req.path,
            pathParameters: req.params,
            queryStringParameters: req.query,
            requestContext: null as any,
            resource: null as any,
            stageVariables: null,
        }
        const result = await hello(awsRequest, null as any, null as any) as APIGatewayProxyResult
        // tslint:enable: id-length no-any no-unsafe-any
        if(result.headers) {
            Object.entries(result.headers).forEach(([key, value]) => res.setHeader(key, value as string | number))
        }

        res
            .status(result.statusCode)
            .json(JSON.parse(result.body))
    })().catch((err) => {
        res.status(501).send()
    })
})


const port = 'PORT' in process.env ? Number(process.env.PORT) : 3000

app.listen(port, () => {
  console.info(`App listening on http://localhost:${port}`)
})
