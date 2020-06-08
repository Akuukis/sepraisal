/* eslint-env mongo */

// mongo mongo.js > results.json
var db = db.getSiblingDB('default')
var cursor = db.blueprints.aggregate([
    {$group: {
        _id: 1,
        collection: {$push: "$steam.collections"}
    }},
    {$unwind: "$collection"},
    {$unwind: "$collection"},
    {$replaceWith: "$collection"},
    {$group: {
        _id: "$id",
        amount: {$sum: 1},
        value: {$first: "$title"},
    }},
    {$match: {amount: {$gte: 5}}},
    {$project: {_id: 0}},
    {$sort: {amount: -1, value: 1}},
])

printjson(cursor.toArray())
