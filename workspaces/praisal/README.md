## How to do performance profile?

```sh
# 1. Add blueprint in question to fixtures (commit)
# 2. Add a new test for it (commit)
# 3. Set that test as `.only` (don't commit)

node --prof $(yarn bin)/jest test unarchive
node --prof-process isolate-0x42b5d00-v8.log > profile.txt
code profile.txt
```

## Note about IDs

Keen has `Type` as sum of `TypeId` and optionally `SubtypeId` for everything.
But `SubtypeId` is globally unique anyways, except where it doesn't exist.
In those cases, substituting `SubtypeId` with `TypeId` still is globally unique.
Therefore I propose a term "Short Type":

- `TypeId`: always exists, but semi-unique (unique only where SubtypeId doesn't exist)
- `SubtypeId`: doesn't always exists, but is globally unique.
- `Type` (Keen's, I call it "LongType"): always exists and is globally unique. But long. Formula: `Type = TypeId + "/" + SubtypeId`
- `Type` (I call it "ShortType"): always exists and is globally unique. And short. Formula: `Type = SubtypeId ?? TypeId`
