/* eslint-env mongo */

const query = {
}

// mongo mongo.js > results.json
var db = db.getSiblingDB('default')
var cursor = db.blueprints.find(query, {thumb: 0, 'sbc.integrityPlanes': 0})

printjson(cursor.toArray())
