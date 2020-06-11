TOP Fleets of Space Engineers
------------------------------------------------------------------------------------------------------------------------


TL;DR: [The results are here](./fleets).



### My Problem

I had a problem: can't find anything in Steam Workshop, or when I do it takes too much time and effort.
I was preparing for a RPG server and custom-made campaign for friends, that required specific kinds of ships and rovers.

Have you ever wished for better Steam Workshop filters too?

I went so far as manually surveying 33 fleets at that time (see [Space Engineers Survey: Fleet Rankings](https://steamcommunity.com/sharedfiles/filedetails/?id=1449611975)).
The survey took hell lots of time to compile even only the basics together.
But it didn't touch the interesting details I was looking for in first place yet, totally wasn't scale-able, and had lots of other problems like subjective criteria's, human error, and so on.

I got excited to solve this problem for once. So I stopped manual surveying, published what's done so far and journeyed on a automation route so I could learn a lot new stuff over couple of months.
Now, after 2 years, it's done.
I was totally right about learning new stuff, but couple of months, jeez, if only I knew..




### The Solution

Go and check it out - [spaceengineerspraisal.net](https://spaceengineerspraisal.net)

In simple words it works like this: there's a server that downloads every blueprint and puts it into a database.
On top of information inside the blueprint itself (basically a list of blocks), the server calculates lots of extra stuff (e.g. Vanilla-ness, acceleration based on thrusters and mass, etc.).
Then on you can see those properties, or filter by them.
That's about it!

But there's a nice side-effect: having such a database is a cool opportunity to create very customized reports.
Today let's delve into the original problem and rank some ~~collections~~ fleets!




### Fleet Rankings v2.0

I will explain how to make such a report.
In fact, if you will kindly ask, you can have a read-only access so that you can make your own reports too!

The database is MongoDB (I'm still doubting this choice of DB but here we are), so we will use MongoDB Shell.


#### 1. Setup

Nothing interesting, see [README](https://github.com/Akuukis/sepraisal/blob/master/workspaces/app/README.md) for details.



#### 2. List collections

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


#### 3. List Fleets

A steam collection can contain anything, even a single floating block blueprint.
What we call a fleet is a subset of collections, whose blueprints are not random garbage but proper ships and rovers (in one word, **vehicles**).
In order to distiguish a floating garbage from a proper vehicle, we need to analyse the blueprint.
Although neccessary that's not sufficient, because "what is a vehicle" is a tricky question itself that also needs to be answered.
So, let's walk through of how I've done:

1. Naive result: 2732 collections equals 2732 fleets. Ha!
2. A vehicle should be useable, right? So, corrupt mods, missing blueprint files, and other reasons that make my server crash a bit will be excluded. That's 2718 collections left.
3. Furthermore, I must be able to paste/print the vehicles in my save/server, so to be on safe side let's look only to blueprints with all blocks being vanilla. That's 2076 collections left.
4. A fleet consists of vehicles not houses, right? Let's take into account only blueprints with a dynamic grid. That's 2002 collections left.
5. Think a bit more on "this is a vehicles" question.. A single floating armor block doesn't count either, right? I have a feeling this is getting complicated fast.
    1. A vehicles must have a power source. That's 1963 collections left.
    2. A vehicles must have a cockpit. That's 1708 collections left.
    3. A vehicles must have means to move - either thruster or wheels. That's 1591 collections left.
    4. A vehicles must have a gyro. That's 1582 collections left.
6. Ok, even if it is a vehicle, then would it work? There's enough vehicles that have honestly written "BROKEN" or "DECOMMISIONED" somewhere, so let's filter those out.
    1. Let's filter out "broken" and synonyms. That's 1581 collections left.
    2. Let's filter out "outdated" and synonyms. That's 1581 collections left.
    3. Let's filter out "obselete" and synonyms. That's 1581 collections left.
    4. Let's filter out "private" and synonyms. That's 1581 collections left.
    5. Let's filter out "work in progress" and synonyms. That's 1578 collections left.
7. As we can see, not much people tag their vehicles with abovementioned keywords. Let's take another cheaper but not that accurate way to spot outdated vehicles - filter out those not updated for a long time. I pick 22 Oct, 2015, because that's when Keen introduced Hydrogen and removed 10x multiplier to dampeners that d many vehicles unusable, as well planets came shortly after. And it almost 5 years already! So, that's 1320 collections left.
8. Collection of one blueprint only isn't really a fleet. Two, I guess, neither. But three, uhm... Ok, let's take collections with at least 5 vehicles. That's 448 collections left.
9. After so much filtering I wonder, who would want to look at fleets with 3 valid vehicles and 97 garbage vehicles? Not me. So, let's filter fleets that have at least 80% of it's blueprints as valid vehicles. That's 208 fleets left.
10. Furthermore, let's use some community power and filter out fleets with very little subscribers. So let's take fleets with 20 or more average subscribers. That's 192 fleets left.

That's it so far. So we have came to a realistic result: 2732 collections boils down to mere 192 fleets. See the query so far [here on Github](https://github.com/Akuukis/sepraisal/blob/master/workspaces/app/static/articles/fleets/mongo.js#L75-L90).


#### 4. Describe those fleets

Just a average subscriber count and title is bare basics, but we can do better.
Let's add some interesting columns.

1. `authors`: seen authors within the fleet. As there can be multiple authors, list all of them.
2. `large grid`: percentage of how many vehicles are large grid instead of small grid.
3. `atmo`: percentage of how many vehicles has any atmospheric thruster on it.
4. `hydro`: percentage of how many vehicles has any hydrogen thruster on it.
5. `ion`: percentage of how many vehicles has any ion thruster on it.
6. `wheel`: percentage of how many vehicles has any wheel suspension on it.
7. `updated`: average updated date of vehicles.
8. `dlc`: percentage of how many vehicles are using DLCs.
9. `script`: percentage of how many vehicles are using programming blocks.

You can see the final query [here on Github](https://github.com/Akuukis/sepraisal/tree/master/workspaces/app/static/articles/fleets/mongo.js#L93-L161).

[**See results here**](./fleets).
