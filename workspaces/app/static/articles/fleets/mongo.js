/* eslint-env mongo */

var tagValidShips = {$set: {validShip: {$and: [
    {$eq: ['$sbc._version', 7]},  // 2. Analyse-able.
    {$eq: ['$sbc.vanilla', true]},  // 3. Vanilla.
    {$eq: ['$sbc.gridStatic', false]},  // 4. Dynamic grids.
    {$or: [  // 5.1. Filter blueprints that have a power source.
        {$gt: ['$sbc.blocks.BatteryBlock/LargeBlockBatteryBlock', 0]},
        {$gt: ['$sbc.blocks.BatteryBlock/SmallBlockBatteryBlock', 0]},
        {$gt: ['$sbc.blocks.BatteryBlock/SmallBlockSmallBatteryBlock', 0]},
        {$gt: ['$sbc.blocks.HydrogenEngine/LargeHydrogenEngine', 0]},
        {$gt: ['$sbc.blocks.HydrogenEngine/SmallHydrogenEngine', 0]},
        {$gt: ['$sbc.blocks.Reactor/LargeBlockLargeGenerator', 0]},
        {$gt: ['$sbc.blocks.Reactor/LargeBlockSmallGenerator', 0]},
        {$gt: ['$sbc.blocks.Reactor/SmallBlockLargeGenerator', 0]},
        {$gt: ['$sbc.blocks.Reactor/SmallBlockSmallGenerator', 0]},
    ]},
    {$or: [  // 5.2. Filter blueprints that have a cockpit.
        {$gt: ['$sbc.blocks.Cockpit/CockpitOpen', 0]},
        {$gt: ['$sbc.blocks.Cockpit/DBSmallBlockFighterCockpit', 0]},
        {$gt: ['$sbc.blocks.Cockpit/LargeBlockCockpit', 0]},
        {$gt: ['$sbc.blocks.Cockpit/LargeBlockCockpitIndustrial', 0]},
        {$gt: ['$sbc.blocks.Cockpit/LargeBlockCockpitSeat', 0]},
        {$gt: ['$sbc.blocks.Cockpit/OpenCockpitLarge', 0]},
        {$gt: ['$sbc.blocks.Cockpit/OpenCockpitSmall', 0]},
        {$gt: ['$sbc.blocks.Cockpit/SmallBlockCockpit', 0]},
        {$gt: ['$sbc.blocks.Cockpit/SmallBlockCockpitIndustrial', 0]},
    ]},
    {$or: [  // 5.3. Filter blueprints that have means to move (thruster or wheel suspension).
        {$gt: ['$sbc.blocks.Thrust/LargeBlockLargeAtmosphericThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/LargeBlockSmallAtmosphericThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/SmallBlockLargeAtmosphericThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/SmallBlockSmallAtmosphericThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/LargeBlockLargeThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/LargeBlockSmallThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/SmallBlockLargeThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/SmallBlockSmallThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/LargeBlockLargeHydrogenThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/LargeBlockSmallHydrogenThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/SmallBlockLargeHydrogenThrust', 0]},
        {$gt: ['$sbc.blocks.Thrust/SmallBlockSmallHydrogenThrust', 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/Suspension3x3", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/Suspension5x5", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/Suspension1x1", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension3x3", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension5x5", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension1x1", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/Suspension3x3mirrored", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/Suspension5x5mirrored", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/Suspension1x1mirrored", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension3x3mirrored", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension5x5mirrored", 0]},
        {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension1x1mirrored", 0]},
    ]},
    {$or: [  // 5.4. Filter blueprints that have a gyro.
        {$gt: ['$sbc.blocks.Gyro/LargeBlockGyro', 0]},
        {$gt: ['$sbc.blocks.Gyro/SmallBlockGyro', 0]},
    ]},
    {$ne: ['$steam.flagsRed', 'broken']},
    {$ne: ['$steam.flagsRed', 'outdated']},
    {$ne: ['$steam.flagsRed', 'obselete']},
    {$ne: ['$steam.flagsRed', 'private']},
    {$ne: ['$steam.flagsRed', 'wip']},
    {$gte: ['$steam.updatedDate', new Date(2015, 10, 22)]},  // 7. Filter out before very old bluprints.
]}}}

var fleetMatchers = [
    {$match: {amount: {$gte: 5}}},  // 8. Filter collections with 3 or more valid blueprints.
    {$match: {$expr: {$gte: [{$divide: ['$amount', '$total']}, 0.8]}}},  // 9. Filter collections with 50%+ valid ships.
    {$match: {subs: {$gte: 20}}},  // 10. Filter collections with 10 or more average subscribers.
]

var db = db.getSiblingDB('default')

const exampleBareMinimumQuery = () => {
    var cursor = db.blueprints.aggregate([
        tagValidShips,
        {$unwind: "$steam.collections"},
        {$group: {
            _id: "$steam.collections.id",
            amount: {$sum: {$toInt: '$validShip'}},
            total: {$sum: 1},
            subs: {$avg: {$multiply: [{$toInt: '$validShip'}, '$steam.subscriberCount']}},
            title: {$first: '$steam.collections.title'},
        }},
        ...fleetMatchers,
        {$sort: {subs: -1}},
    ])
    printjson(cursor.toArray())
}

// Full query with all columnts.
var cursor = db.blueprints.aggregate([
    tagValidShips,
    {$unwind: "$steam.collections"},
    {$group: {
        _id: "$steam.collections.id",
        subs: {$avg: {$multiply: [{$toInt: '$validShip'}, '$steam.subscriberCount']}},
        updated: {$avg: {$toLong: '$steam.updatedDate'}},
        amount: {$sum: {$toInt: '$validShip'}},
        total: {$sum: 1},
        smallGrid: {$sum: {$toInt: {$and: ['$validShip', {$eq: ['$sbc.gridSize', 'Small']}]}}},
        largeGrid: {$sum: {$toInt: {$and: ['$validShip', {$ne: ['$sbc.gridSize', 'Small']}]}}},  // Count Mixed too.
        atmo: {$sum: {$toInt: {$and: ['$validShip', {$or: [
            {$gt: ['$sbc.blocks.Thrust/LargeBlockLargeAtmosphericThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/LargeBlockSmallAtmosphericThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/SmallBlockLargeAtmosphericThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/SmallBlockSmallAtmosphericThrust', 0]},
        ]}]}}},
        hydro: {$sum: {$toInt: {$and: ['$validShip', {$or: [
            {$gt: ['$sbc.blocks.Thrust/LargeBlockLargeHydrogenThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/LargeBlockSmallHydrogenThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/SmallBlockLargeHydrogenThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/SmallBlockSmallHydrogenThrust', 0]},
        ]}]}}},
        ion: {$sum: {$toInt: {$and: ['$validShip', {$or: [
            {$gt: ['$sbc.blocks.Thrust/LargeBlockLargeThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/LargeBlockSmallThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/SmallBlockLargeThrust', 0]},
            {$gt: ['$sbc.blocks.Thrust/SmallBlockSmallThrust', 0]},
        ]}]}}},
        wheel: {$sum: {$toInt: {$and: ['$validShip', {$or: [
            {$gt: ["$sbc.blocks.MotorSuspension/Suspension3x3", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/Suspension5x5", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/Suspension1x1", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension3x3", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension5x5", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension1x1", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/Suspension3x3mirrored", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/Suspension5x5mirrored", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/Suspension1x1mirrored", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension3x3mirrored", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension5x5mirrored", 0]},
            {$gt: ["$sbc.blocks.MotorSuspension/SmallSuspension1x1mirrored", 0]},
        ]}]}}},
        title: {$first: '$steam.collections.title'},
        authors: {$addToSet: '$steam.authors'},
    }},
    {$set: {
        subs: {$round: ['$subs', 0]},  // Round number.
        updated: {$toString: {$toDate: '$updated'}},
        smallGrid: {$round: [{$divide: ['$smallGrid', '$amount']}, 2]},
        largeGrid: {$round: [{$divide: ['$largeGrid', '$amount']}, 2]},
        atmo     : {$round: [{$divide: ['$atmo'     , '$amount']}, 2]},
        hydro    : {$round: [{$divide: ['$hydro'    , '$amount']}, 2]},
        ion      : {$round: [{$divide: ['$ion'      , '$amount']}, 2]},
        wheel    : {$round: [{$divide: ['$wheel'    , '$amount']}, 2]},
    }},
    // Remove duplicate author entries.
    {$set: {authors: {$reduce: { input: '$authors', initialValue: [], in: { $setUnion : ["$$value", "$$this"] } }}}},
    ...fleetMatchers,
    {$sort: {subs: -1, amount: -1, total: -1, title: 1}},
])
printjson(cursor.toArray())
