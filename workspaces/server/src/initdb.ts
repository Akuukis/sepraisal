import { DB_NAME, DB_URL } from '@sepraisal/common'
import { MongoClient } from 'mongodb'

import { main as createIndex } from './reindex'

// Use connect method to connect to the server
export const main = async (): Promise<void> => {
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Connected successfully to server')
    const db = client.db(DB_NAME)
    await db.createCollection('blueprints')

    await createIndex()

    await client.close()
}


// If run as script, run the main.
if(require.main === module) {
    main().catch((err) => console.error(err))
}
