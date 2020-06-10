TOP Fleets of Space Engineers
------------------------------------------------------------------------------------------------------------------------




## My Problem

I had a problem: can't find anything in Steam Workshop, or when I do it takes too much time and effort.
I was preparing for a RPG server and custom-made campaign for friends, that required specific kinds of ships.

Have you ever wished for better Steam Workshop filters too?

I went so far as manually surveying 33 fleets at that time (see [Space Engineers Survey: Fleet Rankings](https://steamcommunity.com/sharedfiles/filedetails/?id=1449611975)).
The survey took hell lots of time to compile even only the basics together.
But it didn't touch the interesting details I was looking for in first place yet, totally wasn't scale-able, and had lots of other problems like subjective criteria's, human error, and so on.

I got excited to solve this problem for once. So I stopped manual surveying, published what's done so far and journeyed on a automation route so I could learn a lot new stuff over couple of months.
Now, after 2 years, it's done.
I was totally right about learning new stuff, but couple of months, jeez, if only I knew..




## The Solution

Go and check it out - [spaceengineerspraisal.net](https://spaceengineerspraisal.net)

In simple words it works like this: there's a server that downloads every blueprint and puts it into a database.
On top of information inside the blueprint itself (basically a list of blocks), the server calculates lots of extra stuff (e.g. Vanilla-ness, acceleration based on thrusters and mass, etc.).
Then on [spaceengineerspraisal.net](https://spaceengineerspraisal.net) you can see those properties, or filter by them.
That's about it!

But there's a nice side-effect: having such a database is a cool opportunity to create very customized reports.
Today let's delve into the original problem and rank some ~~collections~~ fleets!




## Fleet Rankings v2.0

TL;DR: If you just want to see results, scroll down to the last heading.

I will explain how to make such a report.
In fact, if you will kindly ask, you can have a read-only access so that you can make your own reports too!

The database is MongoDB (I'm still doubting this choice of DB but here we are), so we will use MongoDB Shell.


### 1. Setup

Nothing interesting.

> 1. Install MongoDB Client on your computer.
> 2. If on Windows, get a bash terminal with `ssh`.
> 3. Ask for access details and add it to ssh config file at `~/.ssh/config`.
> 4. In first terminal execute `ssh -NL 27018:localhost:27017 sepraisal` and leave it in background. That let's you connect to MongoDB database as if it was locally, making your life easier later.
> 5. In second terminal let's do the actual work. There's two ways about it:
>    1. execute `mongo --port 27018` for interactive shell. Good for playing around. (Don't forget `use default`!)
>    2. execute `mongo --port 27018 --quiet mongo.js > results.json` for executing a scrip in `mongo.js`. Good for generating data and saving them locally.

Create a snippet for saving data
```js
var db = db.getSiblingDB('default')
var cursor = // TODO
printjson(cursor.toArray())
```


### 2. List collections

This is how we get all unique steam collections. A whole 2732 of them - a good start.

```js
db.blueprints.aggregate([
    {$unwind: "$steam.collections"},
    {$group: {
        _id: "$steam.collections.id",
        total: {$sum: 1},
        title: {$first: '$steam.collections.title'},
    }},
    {$sort: {total: -1}},
])
```


### 3. List Fleets

A steam collection can contain anything, even a single floating block blueprint.
What we call a fleet is a subset of collections, whose blueprints are not random garbage but proper ships.
In order to distiguish a floating garbage from a proper ship, we need to analyse the blueprint.
Although neccessary that's not sufficient, because "what is a ship" is a tricky question itself that also needs to be answered.
So, let's walk through of how I've done:

1. Naive result: 2732 collections equals 2732 fleets. Ha!
2. A ship should be useable, right? So, corrupt mods, missing blueprint files, and other reasons that make my server crash a bit will be excluded. That's 2718 collections left.
3. Furthermore, I must be able to paste/print the ships in my save/server, so to be on safe side let's look only to blueprints with all blocks being vanilla. That's 2076 collections left.
4. A fleet consists of ships not houses, right? Let's take into account only blueprints with a dynamic grid. That's 2002 collections left.
5. Think a bit more on "this is a ship" question.. A single floating armor block doesn't count either, right? I have a feeling this is getting complicated fast.
   1. A ship must have a power source. That's 1963 collections left.
   2. A ship must have a cockpit. That's 1708 collections left.
   3. A ship must have a thruster. That's 1591 collections left.
   4. A ship must have a gyro. That's 1582 collections left.
6. Ok, even if it is a ship, then would it fly? There's enough ships that have honestly written "BROKEN" or "DECOMMISIONED" somewhere, so let's filter those out.
   1. Let's filter out "broken" and synonyms. That's 1581 collections left.
   2. Let's filter out "outdated" and synonyms. That's 1581 collections left.
   3. Let's filter out "obselete" and synonyms. That's 1581 collections left.
   4. Let's filter out "private" and synonyms. That's 1581 collections left.
   5. Let's filter out "work in progress" and synonyms. That's 1578 collections left.
7. As we can see, not much people tag their ships with abovementioned keywords. Let's take another cheaper but not that accurate way to spot outdated ships - filter out those not updated for a long time. I pick 22 Oct, 2015, because that's when Keen introduced Hydrogen and removed 10x multiplier to dampeners that d many ships unusable, as well planets came shortly after. And it almost 5 years already! So, that's 1320 collections left.
8. Collection of one blueprint only isn't really a fleet. Two, I guess, neither. But three, uhm... Ok, let's take collections with at least 5 ships. That's 448 collections left.
9. After so much filtering I wonder, who would want to look at fleets with 3 valid ships and 97 garbage ships? Not me. So, let's filter fleets that have at least 80% of it's blueprints as valid ships. That's 208 fleets left.
10. Furthermore, let's use some community power and filter out fleets with very little subscribers. So let's take fleets with 20 or more average subscribers. That's 192 fleets left.

That's it so far. So we have came to a realistic result: 2732 collections boils down to mere 190 fleets. In attachment No.1 you can see the query.

Below is the MongoDB query used:


### 4. Describe those fleets

Just a average subscriber count and title is bare basics, but we can do better.
Let's add some interesting columns.

1. "authors": seen authors within the fleet.
   As there can be multiple authors, list all of them.
2. "large grid %": percentage of how many ships are large grid instead of small grid.
3. "atmo": percentage of how many ships has any atmospheric thruster on it.
4. "hydro": percentage of how many ships has any hydrogen thruster on it.
5. "ion": percentage of how many ships has any ion thruster on it.
6. "wheel": percentage of how many ships has any wheel suspension on it.

You can see the final query [here on Github](https://github.com/Akuukis/sepraisal/tree/master/workspaces/app/static/articles/fleets/mongo.js).

See [**results**]()

### Attachment No.1

Minimal query to test filters.

```js
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
        {$gt: ['$sbc.blocks.Cockpit/LargeBlockCockpitIndustrial', 0]},
        {$gt: ['$sbc.blocks.Cockpit/SmallBlockCockpitIndustrial', 0]},
        {$gt: ['$sbc.blocks.Cockpit/DBSmallBlockFighterCockpit', 0]},
        {$gt: ['$sbc.blocks.Cockpit/SmallBlockCockpit', 0]},
        {$gt: ['$sbc.blocks.Cockpit/CockpitOpen', 0]},
        {$gt: ['$sbc.blocks.Cockpit/LargeBlockCockpitSeat', 0]},
        {$gt: ['$sbc.blocks.Cockpit/OpenCockpitSmall', 0]},
    ]},
    {$or: [  // 5.3. Filter blueprints that have a thruster.
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

db.blueprints.aggregate([
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
]).toArray().length
```
