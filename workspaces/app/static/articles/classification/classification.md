## SE-Praisal Classification System

Before the Space Engineers Praisal, all we easily had access to was block size, block count, grid mass, and a picture.
That's not much data to work with.
All guides essentially proposed their magic numbers for the block count (or something subjective based on picture).
Also the new and shiny Weapons Core mod does so.

Now with Space Engineers Praisal, we now have dozens of various metrics available, and neatly filter-able.
With all the new opportunities I propose to step back and rethink blueprint grouping from first principles.
Everything mentioned below already is possible in Space Engineers Praisal.
This is me thinking out load in hopes to ignite a public discussion on the most useful grouping system for blueprint browsers.
Comments and feedback welcome!


### Classification or Categorization system?

To easily browse many blueprints it's helpful to group similar blueprints together. This grouping problem usually is solved either with categorization or classification system.

As it turns out, there's quite a difference between classes and categories, and well their corresponding systems. There's even a [paper on this topic][paper1], which goes deeper in the differences, as well the problems when they are mixed up. Here's a quick summary:
- like with folders, **in classification system stuff must be placed in exactly one class**.
- like with tags, **in categorization system stuff get zero or more categories attached**.

For example, steam Workshop has both systems. You can select one of 5 types (world, mod, blueprint, script, scenario), which essentialy classification system with 1 hierarchy level that has 5 classes. You can also checkbox none, one or more of 17 provided categories (block, skybox, etc.), which is a categorization system also with 1 hierarchy level.

In the end, the best system is which one is most useful.
I made SE-Praisal for users that browse blueprints with intention fo find the right one and build it.
For that goal, classification would work better to quickly exclude unneeded blueprints, and then use many filters to gradually narrow the rest.
Classification system also is suited for SE-Praisal data, because at the top level blueprints are vastly different.


### How many and what hierarchies of classes?

I decided on specific classes by reading all guides on Steam Workshop that group blueprints in some way or other.
Majority talk about ships only and group based on size and purpose/role, as well mostly agree with each other.
Also I focused on those properties of blueprint that are possible to automatize (sorry, no aesthetics here!).
Therefore the consensus is clear:
- top level is something that "ship" is part of, because everyone silently assumes it. Let's call it **Type**.
- there's a level called **Size**, measured either by blocks, mass, complexity (PCU) or otherwise.
- there's a level called **Role**, a.k.a. purpose.

But there are two ways to order them: either type-size-role, or type-role-size.
Let's check the best order in two ways.

The hierarchies allows to use specialized subclasses based on the class.
It can be nicely double-checked to try to reverse order and see if that feels better. Let's try:

1. Ship type (normal order)
   1. small size. Roles: fighter, bomber, miner, etc. (feels ok)
   2. large size. Roles: destroyer, carrier, industrial, etc.. (feels ok)

2. Ship type (reverse order)
   1. figher role. Sizes: light, heavy, etc. (feels subjective, better leave it to filters)
   2. carrier role. Sizes: light, heavy, etc. (feel useless to divide further?)
   3. (also, I feel bad about this list being overly long)

The hierarchies are useful to ease the narrowing down. So, let's double-check it so: does just line of thought makes sense?
1. Which type do you want? [ship]
2. Which size of it do you want? [small]
3. Which role of it do you want? [fighter]

As we see, in both cases type-size-role feels better than type-role-size. So let's roll with it.


### What will be the classes based on type?

I propose the following top-level **Type** classes:

- Ship
- Car
- Building
- Player Made Weapons (PWMs)
- Other

First type is a ship. Duh. So far so easy.

Second type is a "car".
because "car" subtypes intuitively differ from "ship" subtypes, I put it seperately instead of having a joint "vehicle" type.
But nevertheless, having "car" seperate is tricky for two reasons:
1. Not straight-forward to classify.
   As ships don't need wheels, we could easily classify blueprints as cars by checking whenever they have wheel suspensions.
   But what about mechs (and others) that don't have wheel suspensions?
   But what about ships that for some reason do have wheel suspensions?
   It will lead to misclassification, but let's start with something and then figure out how to improve on that.
2. Not sure where to put blueprints like [Adventurer](steamcommunity.com/sharedfiles/filedetails/?id=875117366).
   Are they wheeled-ships or flying cars?
   These cases are ambigious, although not many.

Third type is a "building".
At first it seems easy - just take static grids and voila.
But unfortunately, many buildings are uploaded with dynamic grid, as well many large ships are uploaded with static grids.
Although for a human eye it feels easy to classify most of those based on silhouette, it's tricky to have clear criteria.
What structural difference is between a station with thrusters for dampering, versus a ship that's even slower than station?
Does stations are prohibited from having a jump drive at all?
For now, blueprint must have a jumpdrive or not be awful slow (1 m/s avg. accel.) to be a ship, otherwise it will be a building.
Let's start with this and see how we can improve on that.

Fourth type is a "Player Made Weapons (PWMs)".
Those are the projectives for grav-cannons, rockets and missile for launchers, etc.
They seem easy to classify - just take a dynamic without a cockit.
First problem with it is that it will misclassify drones as PWMs instead of ships.

Fifth type is "Other".
Steam workshop is full of very specific stuff, or plain crap (like 1-block blueprints), that has to have a seperate type.
The problem is that it's hard to distuish 3-armor grav-canon projective blueprint vs the same 3-block junk blueprint.
For starters "Other" will have only 1-block blueprints (as a subclass), and over time let's see what we can add.

Here's a summary:

| Top level class | Grid type | has wheel suspension | has cockpit | problems
| :--- | :--: | :--: | :--: | :--- |
| Ship | dynamic | NO | YES | flying car vs wheeled ships?
| Car | dynamic | YES | - | what about mechs?
| Building | static | - | - | stations vs slow ships?
| PWMs | dynamic | NO | NO | missiles vs drones?
| Other | - | - | - | case to case bases, e.g. 1-block blueprints.

In conclusion, I guess these 5 types are pretty clear and useful in theory, althouth there's plenty of room for improvement.
Comments and critics welcome!


### Type "Ship" subclasses based on Size

Obviously, there is small grid versus large grid, so that's 2 subclasses there.
From here it gets tricky.

What's sure is how NOT create classes: select a magic number of block amount or something else.
That's the thinking of category way, and a lazy one.
To make a category one would do a research about clusters of stuff and select numbers based on that research,
  like [I did with fighters here](./fighters).
But we are creating classes that rather are "it IS or it IS NOT" type of thing, like small or large grid.
So, what else do we have beside small and large grid?

For small grids, I'd like to talk about print-abilty.
Ships that are print-able will be used way different from non-printable ships (e.g. rebuild in hangar instead of repair).
Printability puts a lot of constraints on a ship blueprint, and one of them is size - it must fit in the printer.
So the question of about selecting a good reference printer and roll with it's size restrictions.

There are many printer designs, but the most reliable and efficient I find welders on a piston.
Given strict restriction on amount of piston per server, our reference printer should have only one piston.
That restricts depth of blueprint to 12.5 meters.
The width and heigh of blueprint is limited by amount of welders, where majority of fighters fall within size of 3x2 welders.
That restricts width to 9.5 meters and height to 7.5 meters.
What's interesting is that of those fighters are outside of these restrictions, they are by little and usually by decorative parts.
And the next step up would be 5x3 welders, which is an immense jump in size, therefore let's stick with 3x2 size.
This suggests us for a 12.5 x 9.5 x 7.5 meters box (to be precise, excluding all corner blocks of that box).
I settled on 12.0 x 9.5 x 7.0 meters box, to that the given ship would fit inside a 5x4x3 large block hangar.

For large grids, we have a critically important block to talk about - the jump drive.
Besides that block being very special on it's own, it's also directly connected to size, and how the ship is played.
On the small size end, the jump drive is just very expensive, plus is a wasted effort below 1,250,000kg of mass.
Jump drive alone requires 300,00 kg of ores to make, which is 3-10 times more than required for a average fighter.
On the large size end, the jump drive becomes the only practial means to move around, because there's no "super-big" thruster block in SE.
Such big ship without a jump drive would either have ridiculous amount of thrusters, or actually are a ship-looking station instead.
So I suggest to seperate large grid into three groups:

> |  | Has Jump Drive | Has NOT Jump Drive |
> | ---: | :--: | :--: |
> | **Maneuverable**: | Large Ship | Corvette |
> | **Dampering only**: | Capital Ship | (actually a Building instead) |

I like where Corvettes are - they are the smallest of all fancy names according to all classificators.
Then, I like the difference between large ships which are still maneuverable, but capitals are too big to afford it.
But what's tricky is that that according to this approach, capital ships doesn't have to be huge - they just have to be awful slow.
The more I think about it the more it makes sense (e.g. meaningfullness of subclasses), but I'm concerned if that's too controversial.
Maybe it just needs a good rename and everything would fall in place?
The other problem is a magic number of average accelaration that divides "dampering only" accelaration from "maneuverable" accelaration.
I hope we can have a nicier criteria for this idea, OR a real good justification for the exact number.
For now I'll call it a 0.5 m/s2, which would take the ship from 0 m/s to 100 m/s in 3 minute and 20 seconds.

Here's a summary:

| Ship subclasses | grid size | dimensions | has jump drive | avg.accel.
| :--- | :--: | :--: | :--: | ---: | ---: |
| Craft | small | fits in 7x9.5x12 box | - | -
| Boat | small | doesn't fit the box | - | -
| Corvette | large | - | NO | maneuverable (>&nbsp;1&nbsp;m/s2)
| Large ship | large | - | YES | maneuverable (>&nbsp;1&nbsp;m/s2)
| Capital ship | large | - | YES | dampering only (<&nbsp;1&nbsp;m/s2)


Again, this is no way perfect, so comments and critics welcome.
Please be verbose with your argumention, so that we can understand why one way is better than other.


### Type "Player Made Weapons (PWMs)" subclasses

These subclasses I found easy to divide - projectile, bomb, torpedo and a missle. Here's a summary:

| PMWs subclasses | warhead | powered | any thruster | remote control
| :--- | :--: | :--: | :--: | :--: | :--: |
| Projectile | yes | no | no | no
| Bomb | yes | yes | no | no
| Torpedo | yes | yes | yes | no
| Missile | yes | yes | yes | yes

I think the straigh-forward thing is that all they require a warhead.
Maybe not literally, but mostly anyways, and if not then all and any junk would classify as a PMW that we don't want to.
Bomb's are powered because that allows them to use sensors or timers that makes bombs a bit "smarter" than projectiles.

So that's it - comments and critique welcome!


### Type "Car, "Building", and "Other" subclasses

This article is already long, and many questions were raised.
I think let's leave these three for another time.



### Next steps

Congratz for reading the whole article!
If you really did so instead of scrolling to the end, please contact me.
I wish to design a useful classification system for players that look for blueprints to build,
and put that into practive on SE-Praisal website.

Let's discuss in comments section at [Steam Guides](asdfasdf), or reach out to me on [official Discord server](https://discord.gg/98VJRWf) (Akuukis#6154).








[paper1]: https://www.ideals.illinois.edu/bitstream/handle/2142/1686/Jacob515540.pdf "Classification and Categorization: A Difference that Makes a Difference (Elin K. Jacob)"
