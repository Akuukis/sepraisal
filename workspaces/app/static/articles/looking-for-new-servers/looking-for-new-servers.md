## Sad story: SE Praisal is looking for new servers

> Also published as [Steam Guide](https://steamcommunity.com/sharedfiles/filedetails/?id=2266803661), you can join the discussion at comments there.


### Current state of affairs

For the last 4 months, SE Praisal was supported by a Latvian gaming community [arma.lv](https://arma.lv/). **Thank you!** Sadly, as their focus moves on to other games, their support came to an end.

Until SE Praisal finds support elsewhere, the website will have only limited functionality:

1. list of blueprints **will not** be updated.
2. loading blueprints, both in browse and analyse, will be **slower**.

Fortunately, I did the extra effort to build the website offline friendly, therefore your uploads and recent analysis are not impacted.


### What's the problem?

Servers need someone to host them. Or 30 EUR/mo to host them in the cloud.

I was OK paying ~1 EUR/mo expenses until now, but I'm not OK with 30 EUR/mo. Therefore, I will only pay the minimum for the next 3 months to give time for SE Praisal to find a sustainable solution.


### What next?

There are 3 options.

First, some Space Engineers community proudly takes over SE Praisal hosting like arma.lv did for 4 months.
**To find SE Praisal a new host, please speak up about SE Praisal to your community admins**.

Second, users pool money to pay cloud hosting expenses. Practically, I sign up at patreon-like platform, you subscribe some monthly amount, and we hope that enough others will do the same. **To sponsor SE Praisal cloud expenses directly, write me on Discord (Akuukis#6154) the amount you are willing to chip in**. There are 10+ daily visitors to SE Praisal, can we make it?

~Third, ad revenue..~ Just joking, I hate ads.

Third and the worst case scenario is **slow death**. Already SE Praisal is not adding new blueprints anymore. After couple of months when I stop paying for the database server, *browse* will stop working entirely. And a year later when I don't renew the domain, the website becomes unreachable. Only source code stays on GitHub forever, waiting for someone to revive it.


### Technical details

SE Praisal consists of two services:

1. a casual server, which has the database of all blueprints and does the filtering for you.
2. a crawler daemon, which every 6 hours looks for new Steam blueprints, analyses them and adds to database.

A casual server doesn't require much resources but requires reliable uptime. Today I setup a `t2.micro`-size server on AWS cloud which does the job (although slowly) for *just* ~9 EUR/mo (for 3 months while I'm paying from my personal pocket).

A crawler daemon requires 2+ CPUs and 6+ GBs of RAM to run properly. The good part is that it has to come online only once every 6 hours or so, and work for approximately an hour. Except time to time when SE Praisal is updated, it will have to work for 3 days non-stop to repraise everything. In AWS prices, that would be around 10-20 EUR/mo with simple on-demand servers, plus 5-10 EUR whenever a full repraisal is required.

If someone would just throw money at it, 30 EUR/mo totally would do as-is. With extra work and AWS black arts the second problem can be massively optimized, but AFAIK 15 EUR/mo is the minimal maintenance cost for a website like SE Praisal.
