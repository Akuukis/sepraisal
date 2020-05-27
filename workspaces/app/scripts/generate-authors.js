// mongo mongo.js > results.json
var db = db.getSiblingDB('default')
var cursor = db.blueprints.aggregate([
    {$group: {
        _id: 1,
        author: {$push: "$steam.authors"}
    }},
    {$unwind: "$author"},
    {$unwind: "$author"},
    {$replaceWith: "$author"},
    {$group: {
        _id: "$id",
        amount: {$sum: 1},
        value: {$first: "$title"},
    }},
    {$match: {amount: {$gte: 10}}},
    {$project: {_id: 0}},
    {$sort: {amount: -1, value: 1}},
])

printjson(cursor.toArray())
