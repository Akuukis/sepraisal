### TODO

- upgrade `react-table`
- upgrade `react-vega`


### Post "Fleet Rankings v2"

1. Install MongoDB Client on your computer.
2. If on Windows, get a bash terminal with `ssh`.
3. Ask for access details and add it to ssh config file at `~/.ssh/config`.
4. In first terminal execute `ssh -NL 27018:localhost:27017 sepraisal` and leave it in background. That let's you connect to MongoDB database as if it was locally, making your life easier later.
5. In second terminal let's do the actual work. There's two ways about it:
    1. execute `mongo --port 27018` for interactive shell. Good for playing around. (Don't forget `use default`!)
    2. execute `mongo --port 27018 --quiet mongo.js > results.json` for executing a scrip in `mongo.js`. Good for generating data and saving them locally.

Create a snippet for saving data
```js
var db = db.getSiblingDB('default')
var cursor = // TODO
printjson(cursor.toArray())
```

Also see [`generate.sh`](./static/articles/fleets/generate.sh) script how to automate above-mentoned steps.

