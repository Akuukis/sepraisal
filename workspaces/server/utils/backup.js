/* eslint-env mongo */

var db = db.getSiblingDB('default')

// Full query with all columnts.
var cursor = db.blueprints.find({}, {_id: true})
printjson(cursor.toArray())
