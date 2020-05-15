import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Paper, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import imageFighterBlockCount from '../../../static/fighter-blockCount.png'
import imageFighterBlockMass from '../../../static/fighter-blockMass.png'
import imageFighterBlockPCU from '../../../static/fighter-blockPCU.png'
import imageFighterOreVolume from '../../../static/fighter-oreVolume.png'
import FaqItem from './FaqItem'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    chart: {
        marginBottom: theme.spacing(4),
        marginLeft: theme.spacing(-8),
        marginRight: theme.spacing(-8),
        width: `calc(100% + ${theme.spacing(16)}px)`,
    },
    heading: {
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({ children, classes, theme, ...props }) => {

    return (
        <Paper className={classes.root}>
            <Typography className={classes.heading} variant='h2' gutterBottom>Questions & Answers</Typography>
            <FaqItem no={1} title='How does SEPraisal categorize all blueprints?'>
                <Typography paragraph component='div'>
                    SEPraisal plans to categorize blueprints in three levels:
                    <ul>
                        <li>Primary level is type: <strong>V</strong>ehicle or <strong>B</strong>uilding</li>
                        <li>Secondary level is size <strong>C</strong>lass: from C1 to C8</li>
                        <li>Tertiary level is purpose.</li>
                    </ul>
                </Typography>
                <Typography paragraph>
                    Let's go through this with this (TODO: link) blueprint.
                    First, the automatic logic downloads and analyses it.
                    Second, script checks grid type that is "dynamic", so script concludes it is a Vehicle (V).
                    Third, script checks it against class size definition (more on it below) - and classifies blueprint as size Class 1 (C1).
                    Fourth, script checks it against several purpose definitions within that class - and assigns to it the "Fighter" purpose.
                    So, blueprint is classified as "VC1 Fighter".
                </Typography>
                <Typography paragraph>
                    For the starters, SEPraisal have only filter presets for "Vehicle", "Vehicle Class 1", and "VC1 Fighter".
                    On the other hand, SEPraisal has many filters and you should be able to combine almost anything you may need.
                </Typography>
                <Typography paragraph component='div'>
                    Here's some more examples how it would generally look:
                    <ul>
                        <li>VC1 is tiny small-block vehicle: Torpedo, Missile, Drone, etc.</li>
                        <li>VC2 is small small-block vehicle: Fighter, Bomber, Scout, Dropship, etc.</li>
                        <li>VC3 is medium small-block vehicle: Heavy Fighter, Heavy Dropship, etc.</li>
                        <li>VC4 is medium large-block vehicle without jump drive: Corvette, etc.</li>
                        <li>VC5 is large large-block vehicle: Industrial Frigate, Torpedo Frigate, etc.</li>
                        <li>VC6 is huge large-block vehicle: Destroyer, Cruiser, Carrier, etc.</li>
                        <li>VC7 is enourmous large-block vehicle that's guild-effort: Battleship, Dreadnought, etc.</li>
                        <li>VC8 is ridiculous large-block vehicle that's killing the server performance-wise. No examples.</li>
                    </ul>
                </Typography>
                <Typography paragraph>
                    I came up with these categories by reading all categorization guides on Steam Workshop.
                    They mostly concern with size and purpose/role, and mostly agree with each other.
                    But they propose only ship categorization, therefore I expanded categories to cover not only ships.
                    Also I focused on those properties of blueprint that are possible to categorize automatically (sorry, no aesthetics here!).
                </Typography>
                <Typography paragraph>
                    Categorization is not even close to be finished.
                    I assume most could agree that a given vehicle class includes the few examples above.
                    But there's yet much to explore and analyse until we can arrive at exhaustive list of purposes within each VC.
                    If you want to help, please contact me and let's talk!
                </Typography>
            </FaqItem>
            <FaqItem no={2} title='How SEPraisal determines "size" of each size class?'>
                <Typography paragraph component='div'>
                    SEPraisal defines "size" as a combination of 4 properties:
                    <ul>
                        <li>Block count</li>
                        <li>Dry mass</li>
                        <li>PCU</li>
                        <li>Ore volume (that's required to build blueprint)</li>
                    </ul>
                </Typography>
                <Typography paragraph>
                    SEPraisal statistically analyses whole Steam Workshop to find out the exact numbers for each size class.
                    Read on for nice charts and more details.
                </Typography>
                <Typography paragraph>
                    In a simplified version, for each size class, the analysis goes like this:
                    <ol>
                        <li>Define few class-specific filter criteria (e.g. small blocks vs large blocks)</li>
                        <li>Add several search keywords for expected blueprints in that class (e.g. "fighter" for VC2)</li>
                        <li>Filter whole Steam Workshop</li>
                        <li>See how many blocks (or mass, PCU, ore volume) the results have</li>
                        <li>Find a range for the most typical results (80%)</li>
                    </ol>
                    There's quite a lot statistics involved, but here's a nice chart on how many block count has "VC2 Fighter":
                </Typography>
                <img src={imageFighterBlockCount} className={classes.chart} />
                <Typography paragraph>
                    The bars are frequency of block count amount and the blue line shows an approximated model of the results.
                    The colors show zones of "typicality".
                    For example, blueprints in green area (135 to 554 blocks) are the most typical ones
                        - half of blueprints are in this area.
                    <strong> 4 out of 5 blueprints are in green and yellow area (103 to 1,197 blocks).
                    They are typical enough to be considered "VC2 Fighter"</strong>.
                    The remaining 15% falls in red zone, 3% in grey zone, and 2% are off the chart.
                </Typography>
                <Typography paragraph>
                    Here's the rest of "VC2 Fighter" charts for mass, PCU and required ore volume:
                </Typography>
                <img src={imageFighterBlockMass} className={classes.chart} />
                <img src={imageFighterBlockPCU} className={classes.chart} />
                <img src={imageFighterOreVolume} className={classes.chart} />
            </FaqItem>
            <FaqItem no={3} title='What filters exactly are under "Any ship, vanilla"?'>
                <Typography paragraph>
                    To be specific, here's the full list of filter that defines what "Any ship, vanilla" is:
                    <ul>
                        <li>Has grid type only "dynamic"</li>
                        <li>Has only vanilla blocks</li>
                        <li>Has at least 1 gyro block ("SmallBlockGyro")</li>
                        <li>Has at least 1 energy source block ("SmallBlockBatteryBlock", "SmallBlockSmallGenerator" or "SmallBlockLargeGenerator")</li>
                        <li>Has at least 1 cockpit block ("SmallBlockCockpit" or "DBSmallBlockFighterCockpit")</li>
                    </ul>
                </Typography>
                <Typography paragraph>
                    In my opinion, that's the pure minimum for a blueprint to count as a vehicle.
                    Except, the vanilla filter is used because SEPraisal doesn't support modded blocks, yet.
                </Typography>
            </FaqItem>
            <FaqItem no={4} title='What filters exactly are under "Fighter, vanilla"?'>
                <Typography paragraph>
                    To be specific, here's the full list of filter that defines what "Figher, vanilla" is:
                    <ol>
                        <li>Has grid type only "dynamic"</li>
                        <li>Has only vanilla blocks</li>
                        <li>Has at least 1 gyro block ("SmallBlockGyro")</li>
                        <li>Has at least 1 energy source block ("SmallBlockBatteryBlock", "SmallBlockSmallGenerator" or "SmallBlockLargeGenerator")</li>
                        <li>Has at least 1 cockpit block ("SmallBlockCockpit" or "DBSmallBlockFighterCockpit")</li>
                        <li>Has only "Small" grid(s)</li>
                        <li>Has at least 1 static weapon block ("SmallGatlingGun" or "SmallMissileLauncher")</li>
                        <li>Has from 103 to 1,197 blocks</li>
                        <li>Has from 9,053 to 80,361 kg mass</li>
                        <li>Has from 1205 to 6546 PCU</li>
                        <li>Has from 7,102 to 59,263 litres ore required to build</li>
                    </ol>
                </Typography>
                <Typography paragraph>
                    Regarding first 1-7 criteria, in my opinion, that's the neccessary requirements for a blueprint to try to count as a fighter.
                </Typography>
                <Typography paragraph>
                    Regarding latter 8-11 criteria, that's how 4 out of 5 blueprints actually are when you filter
                        by first 1-7 criteria and keywords like "fighter" and similar.
                </Typography>
            </FaqItem>
            <FaqItem no={5} title='How much blueprints does SE-Praisal have?'>
                <Typography paragraph>
                    SE-Praisal has 99,999 blueprints and growing (updated Feb 29, 2020), minus few hundred with errors -
                        missing or corrupt blueprint inside workshop file,
                        enourmous blueprint filesize (10MB+),
                        and misc technical problems.
                </Typography>
            </FaqItem>
            <FaqItem no={6} title='How often SEPraisal is updated?'>
                <Typography paragraph>
                    Four times a day SEPraisal adds all new browse-able blueprints to it's database.
                </Typography>
                <Typography paragraph>
                    Once in a week SEPraisal updates each blueprint.
                </Typography>
            </FaqItem>
            <FaqItem no={7} title='Does SE-Praisal has all blueprints?'>
                <Typography paragraph>
                    Yes, sort of.
                </Typography>
                <Typography paragraph>
                    At the time of writing, Steam shows that there are 150,000+ blueprints at Space Engineers workshop.
                    Although it most likely is true, there's a problem.
                    When browsing workshop, e.g. click "next page" again and again, at page 1670 or so there's an end.
                    <em> Really, try it now. </em>
                    Furthermore, not every 30-blueprint page has 30 blueprints - sometimes as little as 26.
                    Also, some blueprints make it on two pages - at the end of one and at the start of next one.
                    On the good note, Steam Workshop can be browsed both by "newest" and "most popular", although much of it overlaps.
                </Typography>
                <Typography paragraph>
                    Out of 150,000+ blueprints
                        in theory it gives upper limit of 100,200 (=16700*30*2) blueprints,
                        but in practice that's around 70,000 browse-able blueprints.
                    But the old and unpopular blueprints have slided beyond the last page of Steam Workshop.
                </Typography>
                <Typography paragraph>
                    SEPraisal has much more than 70,000 blueprints.
                    Even if blueprint becomes not browse-able later, SEPraisal has already discovered it, and will keep it updated like others.
                    Because of that one may joke that SEPraisal has more than all blueprints :)
                </Typography>
            </FaqItem>
            <FaqItem no={8} title='Can I use your data for my research?'>
                <Typography paragraph>
                    Most likely yes, please contact Akuukis and let's talk!
                </Typography>
                <Typography paragraph component='div'>
                    You can see raw data for yourself, here's some examples:
                    <ol>
                        <li><a target="_blank" rel="noopener noreferrer" href='https://db.spaceengineerspraisal.net/hello?find=%7B%22_id%22%3A688170108%7D&limit=1'>Querry a specific blueprint with all data points</a></li>
                        <li><a target="_blank" rel="noopener noreferrer" href='https://db.spaceengineerspraisal.net/hello?find=%7B%22%24and%22%3A%5B%7B%22sbc%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc._version%22%3A%7B%22%24eq%22%3A6%7D%7D%2C%7B%22sbc.vanilla%22%3Atrue%7D%2C%7B%22sbc.blocks.Gyro%2FSmallBlockGyro%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22%24or%22%3A%5B%7B%22sbc.blocks.BatteryBlock%2FSmallBlockBatteryBlock%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc.blocks.Reactor%2FSmallBlockSmallGenerator%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc.blocks.Reactor%2FSmallBlockLargeGenerator%22%3A%7B%22%24exists%22%3Atrue%7D%7D%5D%7D%2C%7B%22%24or%22%3A%5B%7B%22sbc.blocks.Cockpit%2FSmallBlockCockpit%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc.blocks.Cockpit%2FDBSmallBlockFighterCockpit%22%3A%7B%22%24exists%22%3Atrue%7D%7D%5D%7D%2C%7B%22sbc.gridSize%22%3A%22Small%22%7D%2C%7B%22%24or%22%3A%5B%7B%22sbc.blocks.SmallGatlingGun%2F%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc.blocks.SmallMissileLauncher%2F%22%3A%7B%22%24exists%22%3Atrue%7D%7D%5D%7D%2C%7B%22sbc.blockCount%22%3A%7B%22%24gte%22%3A103%2C%22%24lte%22%3A1197%7D%7D%2C%7B%22sbc.blockMass%22%3A%7B%22%24gte%22%3A9053%2C%22%24lte%22%3A80361%7D%7D%2C%7B%22sbc.blockPCU%22%3A%7B%22%24gte%22%3A1205%2C%22%24lte%22%3A6546%7D%7D%2C%7B%22sbc.oreVolume%22%3A%7B%22%24gte%22%3A7102%2C%22%24lte%22%3A59263%7D%7D%5D%7D&projection=%7B%22classes%22%3A%7B%22_error%22%3Atrue%2C%22_revision%22%3Atrue%2C%22_version%22%3Atrue%7D%2C%22sbc%22%3A%7B%22_error%22%3Atrue%2C%22_revision%22%3Atrue%2C%22_version%22%3Atrue%2C%22blockCount%22%3Atrue%2C%22blockPCU%22%3Atrue%2C%22blockTime%22%3Atrue%2C%22componentTime%22%3Atrue%2C%22flagsGreen%22%3Atrue%2C%22flagsRed%22%3Atrue%2C%22flagsYellow%22%3Atrue%2C%22gridSize%22%3Atrue%2C%22ingotTime%22%3Atrue%2C%22oreVolume%22%3Atrue%7D%2C%22steam%22%3A%7B%22_error%22%3Atrue%2C%22_thumbName%22%3Atrue%2C%22_updated%22%3Atrue%2C%22_version%22%3Atrue%2C%22author%22%3Atrue%2C%22collections%22%3Atrue%2C%22flagsGreen%22%3Atrue%2C%22flagsRed%22%3Atrue%2C%22flagsYellow%22%3Atrue%2C%22id%22%3Atrue%2C%22postedDate%22%3Atrue%2C%22ratingCount%22%3Atrue%2C%22ratingStars%22%3Atrue%2C%22revision%22%3Atrue%2C%22subscriberCount%22%3Atrue%2C%22title%22%3Atrue%2C%22updatedDate%22%3Atrue%7D%2C%22thumb%22%3A%7B%22_error%22%3Atrue%2C%22_revision%22%3Atrue%2C%22_version%22%3Atrue%2C%22webp%22%3Atrue%7D%7D&sort=%7B%22subscriberCount%22%3A-1%7D&limit=12'>Querry "Fighter, vanilla" filter with only some data points</a></li>
                    </ol>
                </Typography>
                <Typography paragraph>
                    Also, for advanced filter options see "Advanced" in filter's sidebar.
                    It's possible to define a lot more than by using "Custom" filter controls!
                </Typography>
            </FaqItem>
        </Paper>
    )
})) /* ============================================================================================================= */
