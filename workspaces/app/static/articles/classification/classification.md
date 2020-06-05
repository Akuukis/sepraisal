## SE Praisal Classification System

> This article is me thinking out loud in hopes to ignite a public discussion on the most useful grouping system for blueprint browsers.
> Comments and feedback welcome!


### Obsolete limitations

Before the Space Engineers Praisal, all we had an easy access to was: block size, block count, grid mass, and a picture.
That's not much data to work with.
All guides essentially proposed their classification magic numbers for the block count (or something subjective based on picture).
Even the new and shiny Weapons Core mod does so.

Now with Space Engineers Praisal, we have dozens of neatly filter-able metrics available.
So, I propose to step back and rethink blueprint grouping from first principles.
In this article I'll show you some examples that already are possible with Space Engineers Praisal.


### Classification or Categorization system?

To easily browse a pile of blueprints it's helpful to group similar blueprints together.
Grouping usually is solved either with categorization or classification system.

As it turns out, there's quite a difference between classes and categories as well as their corresponding systems.
There's even a [paper on this topic][paper1], which goes deeper in the differences and the problems that happend when classification and categorization are mixed up.
Here's a quick summary:
- like with folders, **in classification system stuff must be placed in exactly one class**.
- like with tags, **in categorization system stuff get zero or more categories attached**.

For example, steam Workshop has both systems.
You can select one of 5 types/classes: world, mod, blueprint, script and scenario.
This is a classification system with 1 hierarchy level of 5 classes.
You can also checkbox none, one or more of 17 provided categories (block, skybox, etc.).
This is a categorization system with 1 hierarchy level.

In the end, the best system is the one most used.
I made SE Praisal for users that browse blueprints with the intention to find the right blueprint and build it.
For that goal, classes would work better to quickly exclude unneeded blueprints.
After removing the big chunk, users could apply filters to gradually narrow the rest.
Classification system also is suited for SE Praisal data, because at the top level blueprints are vastly different.


### How many and what hierarchies of classes there should be?

I chose classes by reading all guides on Steam Workshop that group blueprints in some way or another.
They mostly agree with each other and the majority talk about ships only and group them based on size and purpose/role.
Also I focused on those properties of blueprint that are possible to automatize (sorry, no aesthetics here!).
Therefore the consensus is clear:
- top level is something that "ship" is part of, because everyone silently assumes it. Let's call it **Type**.
- there's a level called **Size**, measured either by blocks, mass, complexity (PCU) or otherwise.
- there's a level called **Role**, a.k.a. purpose.

But there are two ways to order them: either Type-Size-Role (TSR), or Type-Role-Size (TRS).
The best order we are yet to find with 2 mental excercises.

First, let's test possible subclasses.
Depending on choosing order, they can provide more or less meaningful subclasses.

1. TSR order
    - ship, small size, fighter/bomber/miner/... (feels ok)
    - ship, large size, destroyer/carrier/industrial/... (feels ok)

2. TRS order
    - ship, fighter, light/heavy/... (feels subjective, better leave it to filters)
    - ship, carrier, light/heavy/... (feel useless to divide further?)

Second, let's test thought process.
Depending on order choice, we can more or less easily narrow down to the blueprints we are actually interesed in.

Does this line of thought makes sense?

1. TSR:
    1. Which type do you want? [ship]
    2. Which size of it do you want? [small]
    3. Which role of it do you want? [fighter]

2. TRS:
    1. Which type do you want? [ship]
    2. Which role of it do you want? [fighter]
    3. Which size of it do you want? [amm.. aren't all fighters small?]

At least for me, in both cases Type-Size-Role feels better than Type-Role-Size.
So let's roll with it.


### What will be the Blueprint classes based on Type?

All Steam guides assume that ship is top level class.
Let me add some more top-level classes next to ships to be inclusive for all blueprints:

I propose these **Type** classes:
- Ship
- Car
- Building
- Player Made Weapons (PWMs)
- Other

First type is a **Ship**. Duh. So far so easy.

Second type is a **Car**. 
I put it seperately instead of having a joint **Vehicle** type because **Car** subtypes intuitively differ from **Ship** subtypes.
But nevertheless, having **Car** separate is tricky for two reasons:
1. Not straight-forward to classify.
    As ships don't need wheels, we could easily classify blueprints as cars by checking whether they have wheel suspensions.
    But what about mechs (and others) that don't have wheel suspensions?
    But what about ships that for some reason do have wheel suspensions?
    It surely will lead to misclassification, but it is better to start with something and then figure out how to improve on that.
2. Not sure where to put blueprints like [Adventurer](steamcommunity.com/sharedfiles/filedetails/?id=875117366).
    Are they wheeled-ships or flying cars?
    These cases are ambigious, although not many.

Third type is a **Building**.
At first it seems easy - just take static grids and voilà.
Unfortunately, many buildings are uploaded with dynamic grid and a lot of large ships are uploaded with static grid.
Although for a human eye it feels easy to classify most of them based on silhouette, it's tricky to have clear criteria.
What structural difference is between a station with thrusters for dampering, versus a ship that's even slower than a station?
Are stations prohibited from having a jump drive at all?
For now, let's say that a **Building** must lack a jump drive and move slower than 0.5 m/s. Otherwise it will be classified as a weirdo ship.
Let's start with this and see how we can improve on that.

Fourth type - **Player Made Weapons (PWMs)**.
Those are the projectiles for grav-cannons, rockets and missile for launchers, etc.
They seem easy to classify - just take a dynamic grid without a cockpit.
Main problem - it will misclassify drones as **PWMs** instead of ships.

Fifth type is **Other**.
Steam workshop is full of very specific stuff and plain crap (like 1-block blueprints).
These need to have a seperate type.
The problem is that it's hard to distinguish 3-armor grav-canon projectile blueprint with the same 3-block junk blueprint.
For starters **Other** will have only 1-block blueprints (as a subclass), and over time let's see what we can add.

Here's a summary:

| Top level class | Grid type | Wheel suspension | Cockpit | Problems
| :-- | :-- | :-- | :-- | :-- |
| Ship | dynamic | NO | YES | flying car vs wheeled ships?
| Car | dynamic | YES | - | what about mechs?
| Building | static | - | - | stations vs slow ships?
| PWMs | dynamic | NO | NO | missiles vs drones?
| Other | - | - | - | case to case bases, e.g. 1-block blueprints.

In conclusion, I guess these 5 types are pretty clear and useful in theory, althouth there's plenty of room for improvement.


### What will be the Blueprint subclasses based on Size?
This article already is a long one.
And by me writing here, it just gets longer.
So, for now we will look at subclasses for only 2 top level classes - the most interesting one, and the easiest - **Ships** and **PMWs**.

Or in other words, it's time for Type-Size-Role **Size** part.


#### Subclasses of **Ship** class

Obviously, there easiest way to classify by **Size** is small grid vs large grid.
This is a good criteria - it's simple and has only 2 options.
But 2 options is not enough.

I can also show you how NOT to create classes: select a magic number of block amount or something else.
This is a lazy category thinking.
To make a category one would do a research about clusters of stuff and select numbers based on that research, like [I did with fighters here](./fighters).
But we are creating classes that can provide a "YES" or "NO" answers to criteria, like small or large grid.
So, what other critearia do we have?


##### Small grids

For small grids, I'd like to talk about print-abilty.
Ships that are print-able will be used way different from non-printable ships (thrown out instead of repaired).
Printability puts a lot of constraints on a ship blueprint, and one of them is size - it must fit in the printer.
Therefor we switch the question of blueprint size to a question about an optimal reference printer and roll with it's size restrictions.

There are many printer designs, but I find the most reliable and efficient are [welders on a piston](https://steamcommunity.com/sharedfiles/filedetails/?id=2066785552).
Given the strict restrictions on amount of pistons per server, our reference printer should have only one piston.
That makes the max depth of blueprint to 12.5 meters.
The width and heigh of blueprint is limited to the amount of welders, where majority of fighters fall within size of 9.5 x 7.5 meters which corresponds to 3x2 welders.

We could take some more welders, but there is not much use of it.
First, most fighters that are bigger than 3x2 welders, are bigger only by little and usually by decorative parts.
Second, the next step up would be 5x3 welders, which is an immense jump in size.
Seems better to stick with 3x2 size, right?

So, by using 3x2 welders and one piston, we get a box size: 12.5 x 9.5 x 7.5 meters (excluding all corner blocks).
Let's use 12.0 x 9.5 x 7.0 meters box, so that the given ship would also fit inside a 5x4x3 large block hangar.
Blueprints that fit in the box I'll call **Crafts**, those that do not - **Boats**.


##### Large grids

For large grids, we have a critically important block to talk about - the jump drive.
Besides it being very special on it's own, jump drive is also directly connected to ship size and how the ship is played.

On the small size end, the jump drive may cost even more than 1/2 of all ships resources, plus it's inefficient below 1,250,000 kg of mass.
Jump drive alone requires [300,00 kg of ores to make](https://spaceengineerspraisal.net/analyse?steam=490237431).
A lot, don't you think?

On the large size end, the jump drive becomes the only practial means to move around, because there is no *super-big* thruster block in SE.
A big ship without a jump drive would either have ridiculous amount of thrusters or it actually is a station masked as a ship instead.

I suggest to separate large grid into 3 groups:

> |  | Has Jump Drive | Has NOT Jump Drive |
> | ---: | :--: | :--: |
> | **Maneuverable**: | Large Ship | Corvette |
> | **Dampering only**: | Capital Ship | (actually a **Building** instead) |

The smallest of the large ships - **Corvettes** - are easy.
They are the smallest of all fancy names (corvettes, frigattes...) according to all classificators.
Then the next in Size come **Large Ships** that are still maneuverable and lastly - **Capital Ships** which are too big to afford easy movement changes.

The first problem: according to this approach, **Capital Ships** don't have to be huge - they just have to be very slow.
The more I think about it the more it makes sense to me (remember, meaningful subclasses!), but I'm concerned if that's only me and is too controversial for general public.
Maybe it just needs a good rename and everything would fall in place?

The second problem: find the magic number of average acceleration that divides *dampering only* accelaration from *maneuverable* acceleration.
For now I'll call it a 0.5 m/s2, which would take the ship from 0 m/s to 100 m/s in 3 minute and 20 seconds.
I hope we can have a nicer criteria for this idea, OR a real good justification for this exact number.

Here's a summary:

| Ship subclasses | grid size | dimensions | has jump drive | avg.accel.
| :--- | :--: | :--: | :--: | ---: | ---: |
| Craft | small | fits in 7x9.5x12 box | - | -
| Boat | small | doesn't fit the box | - | -
| Corvette | large | - | NO | maneuverable (>&nbsp;0.5&nbsp;m/s2)
| Large ship | large | - | YES | maneuverable (>&nbsp;0.5&nbsp;m/s2)
| Capital ship | large | - | YES | dampering only (<&nbsp;0.5&nbsp;m/s2)


Again, this is no way perfect, so comments and critics welcome.
Please be verbose with your argumentation, so that we can understand why one way is better than the other.


#### Subclasses of **Player Made Weapons (PMWs)** class

**PMWs** are so diverse, so let's think about minimal blocks required for the weapon.
The first and straight-forward criteria - to be a **PMW** you need a warhead.
Maybe not literally, but mostly anyways. If not, then all and any junk would classify as a **PMW** and we don't want that.

**Projectile** essentially is just a warhead.
**Bomb's** are powered because that allows them to use sensors or timers that makes bombs a bit *smarter* than projectiles.
**Torpedo** is a warhead with a thruster and power source for it.
**Missile** is a guided torpedo either by player, scripts or combination of both.

Here's a summary:

| PMWs subclasses | warhead | powered | any thruster | remote control
| :--- | :--: | :--: | :--: | :--: | :--: |
| Projectile | yes | no | no | no
| Bomb | yes | yes | no | no
| Torpedo | yes | yes | yes | no
| Missile | yes | yes | yes | yes


### Type "Car, "Building", and "Other" subclasses

This article is already long, and many questions were raised.
I think let's leave these three for another time.


### Next steps

Congratulations for reading the whole article!
If you really did so instead of scrolling to the end, please contact me.
I wish to design a useful classification system for players that look for blueprints to build,
and put that into practice on SE Praisal website.

Let's discuss in comments section at [Steam Guides](asdfasdf), or reach out to me on [official Discord server](https://discord.gg/98VJRWf) (Akuukis#6154).


[paper1]: https://www.ideals.illinois.edu/bitstream/handle/2142/1686/Jacob515540.pdf "Classification and Categorization: A Difference that Makes a Difference (Elin K. Jacob)"
