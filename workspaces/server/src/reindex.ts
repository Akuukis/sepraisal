import { DB_NAME, DB_URL, IBlueprint } from '@sepraisal/common'
import { Collection, IndexOptions, MongoClient } from 'mongodb'


const recreateIndex = async (
        collection: Collection<IBlueprint>,
        fieldOrSpec: string | Record<string, string | number>,
        options: IndexOptions & {name: string},
    ) => {
        const indexName =  options.name
        try {
            await collection.dropIndex(indexName)
            console.info(`Index "${indexName}" dropped.`)
        } catch(err) {
            if(err.codeName !== 'IndexNotFound') throw err
            console.info(`Index "${indexName}" not found.`)
        }
        await collection.createIndex(fieldOrSpec, options)
        console.info(`Index "${indexName}" created.`)
}

// Use connect method to connect to the server
export const main = async (): Promise<void> => {
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Connected successfully to server')
    const db = client.db(DB_NAME)
    const collection = db.collection<IBlueprint>('blueprints')

    // tslint:disable-next-line: no-commented-code - Snippets for database indexing.
    await recreateIndex(collection, { 'steam.subscriberCount': 1 }, { name: "SubscriberCountIndex" })
    await recreateIndex(collection, { 'sbc.blockCount': 1 }, { name: "BlockCountIndex" })
    await recreateIndex(collection, { 'sbc.blockMass': 1 }, { name: "BlockMassIndex" })
    await recreateIndex(collection, { 'sbc.blockPCU': 1 }, { name: "BlockPCUIndex" })
    await recreateIndex(collection, { 'sbc.oreVolume': 1 }, { name: "OreVolumeIndex" })
    await recreateIndex(collection, {
            '_id': 'text',
            'steam.title': 'text',
            'steam.description': 'text',
            'sbc.gridTitle': 'text',
        },
        {
            name: 'TextIndex',
            weights: {
                '_id': 100,
                'steam.title': 10,
                'sbc.gridTitle': 2,
                'steam.description': 1,
            }
        } as any)  /* eslint-disable-line @typescript-eslint/no-explicit-any */  // TODO: Is that bad upstream types?

    // Snippet for pruning the database.
    // const deleted = await collection.deleteMany({'steam.subscriberCount': {$lt: 100}})
    // console.log(`Pruned: ${deleted.result.n}`)

    await client.close()
}


// If run as script, run the main.
if(require.main === module) {
    main().catch((err) => console.error(err))
}
