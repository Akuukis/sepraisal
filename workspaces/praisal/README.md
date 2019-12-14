## How to do performance profile?

```sh
# 1. Add blueprint in question to fixtures (commit)
# 2. Add a new test for it (commit)
# 3. Set that test as `.only` (don't commit)

node --prof $(yarn bin)/jest test unarchive
node --prof-process isolate-0x42b5d00-v8.log > profile.txt
code profile.txt
```
