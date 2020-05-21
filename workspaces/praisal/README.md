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


## Note about Sbc, DTOs and models

I have a dream to have a symetric relationship between raw sbc, sbc parts, dtos and models, like this:

Stuff
- "Raw Sbc Part": a string that's a valid XML and equals to those found in `.sbc` files.
- "Sbc Part": an object, `xml2js`-valid representation of "Raw Sbc Part", although unwiedly and overly compilated.
- "DTO": an object, simplified and standartized version of "Sbc Part".
- "Model": an instance, that gives handly methods on top of DTO's properties.

Conversions:
- "Raw Sbc Part" -> "Sbc Part": carried out by `xml2js` library.
- "Sbc Part" -> "DTO": carried out by custom parsers, found in `parsers` folder.
- "DTO" -> "Model": constructor of models, found in `models` folder.
- "Model" -> "DTO": the `toJSON()` method on models (useful for serialization in testsuite snaps)
- "DTO" -> "Sbc Part": *missing*
- "Sbc Part" -> "Raw Sbc Part": can be carried out by `xml2js` library

If it would have all conversions in place, the praisal could not only praise, but also edit and generate valid `.sbc` files.
The lowest hanging fruit would be to automatically strip LCD from small-font-pictures, which bloats blueprint size and impacts multiplayer servers.
Although possibilities are many: put actions in cockpit hotbar, put uranium in reactors, rename blocks, etc.
That can both assist blueprint creators in their work, as well automatically improve any blueprint before it's use in game.

Currently structure is in place, but there's much left to do.
Also note that currently `toJSON()` methods convert from "Model" to "Sbc Part" instead, which I'm starting to regret.
