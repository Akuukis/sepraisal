### TODO

- upgrade `react-table`
- upgrade `react-vega`


#### Authors & Collections

```ts
// TODO: Create API and get these "value"s dynamically.

// var db = db.getSiblingDB('default')
// var cursor = db.blueprints.aggregate([
//     { $match: { steam: {$exists: true} } },
//     { $group: { _id: "$steam.author.title", count: { $sum: 1 } } },
//     { $match: { count: {$gte: 10} } },
//     { $sort : { count: -1 } },
// ])
// while(cursor.hasNext()) printjson(cursor.next())

// var db = db.getSiblingDB('default')
// var cursor = db.blueprints.aggregate([
//     { $match: { steam: {$exists: true} } },
//     { $group: { _id: "$steam.collections", count: { $sum: 1 } } },
//     { $match: { count: {$gte: 5} } },
//     { $sort : { count: -1 } },
// ])
// while(cursor.hasNext()) printjson(cursor.next())

// var theMap = new Map<number, {value: string, amount: number}>()
// AUTOCOMPLETE_COLLECTIONS_RAW.forEach((entry) => {
//     entry._id.forEach((collection) => {
//         if(theMap.has(collection.id)) {
//             theMap.get(collection.id)!.amount = theMap.get(collection.id)!.amount + entry.amount
//         } else {
//             theMap.set(collection.id, {value: collection.value, amount: entry.amount})
//         }
//     })
//     // .push(...entry._id)
// })
// console.log(AUTOCOMPLETE_COLLECTIONS_RAW.length, theMap.size)
// console.log(JSON.stringify([...theMap.values()].sort((a, b) => b.amount - a.amount), undefined, 2))

```
