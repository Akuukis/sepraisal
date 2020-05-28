import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyLink from 'src/components/MyLink'

import FaqItem from './FaqItem'
import InfoCard from './InfoCard'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    chart: {
        marginBottom: theme.spacing(4),
        marginLeft: theme.spacing(-8),
        marginRight: theme.spacing(-8),
        width: `calc(100% + ${theme.spacing(16)}px)`,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({ children, classes, theme, ...props }) => {

    return (
        <InfoCard className={classes.root} heading='Questions & Answers'>
            <FaqItem no={1} title='What filters exactly are under "Any ship, vanilla"?'>
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
            <FaqItem no={2} title='What filters exactly are under "Fighter, vanilla"?'>
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
            <FaqItem no={3} title='How much blueprints does SE-Praisal have?'>
                <Typography paragraph>
                    SE-Praisal has 99,999 blueprints and growing (updated Feb 29, 2020), minus few hundred with errors -
                        missing or corrupt blueprint inside workshop file,
                        enourmous blueprint filesize (10MB+),
                        and misc technical problems.
                </Typography>
            </FaqItem>
            <FaqItem no={4} title='How often SEPraisal is updated?'>
                <Typography paragraph>
                    Four times a day SEPraisal adds all new browse-able blueprints to it's database.
                </Typography>
                <Typography paragraph>
                    Once in a week SEPraisal updates each blueprint.
                </Typography>
            </FaqItem>
            <FaqItem no={5} title='Does SE-Praisal has all blueprints?'>
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
            <FaqItem no={6} title='Can I use your data for my research?'>
                <Typography paragraph>
                    Most likely yes, please contact Akuukis and let's talk!
                </Typography>
                <Typography paragraph component='div'>
                    You can see raw data for yourself, here's some examples:
                    <ol>
                        <li><MyLink href='https://db.spaceengineerspraisal.net/hello?find=%7B%22_id%22%3A688170108%7D&limit=1'>Querry a specific blueprint with all data points</MyLink></li>
                        <li><MyLink href='https://db.spaceengineerspraisal.net/hello?find=%7B%22%24and%22%3A%5B%7B%22sbc%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc._version%22%3A%7B%22%24eq%22%3A6%7D%7D%2C%7B%22sbc.vanilla%22%3Atrue%7D%2C%7B%22sbc.blocks.Gyro%2FSmallBlockGyro%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22%24or%22%3A%5B%7B%22sbc.blocks.BatteryBlock%2FSmallBlockBatteryBlock%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc.blocks.Reactor%2FSmallBlockSmallGenerator%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc.blocks.Reactor%2FSmallBlockLargeGenerator%22%3A%7B%22%24exists%22%3Atrue%7D%7D%5D%7D%2C%7B%22%24or%22%3A%5B%7B%22sbc.blocks.Cockpit%2FSmallBlockCockpit%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc.blocks.Cockpit%2FDBSmallBlockFighterCockpit%22%3A%7B%22%24exists%22%3Atrue%7D%7D%5D%7D%2C%7B%22sbc.gridSize%22%3A%22Small%22%7D%2C%7B%22%24or%22%3A%5B%7B%22sbc.blocks.SmallGatlingGun%2F%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22sbc.blocks.SmallMissileLauncher%2F%22%3A%7B%22%24exists%22%3Atrue%7D%7D%5D%7D%2C%7B%22sbc.blockCount%22%3A%7B%22%24gte%22%3A103%2C%22%24lte%22%3A1197%7D%7D%2C%7B%22sbc.blockMass%22%3A%7B%22%24gte%22%3A9053%2C%22%24lte%22%3A80361%7D%7D%2C%7B%22sbc.blockPCU%22%3A%7B%22%24gte%22%3A1205%2C%22%24lte%22%3A6546%7D%7D%2C%7B%22sbc.oreVolume%22%3A%7B%22%24gte%22%3A7102%2C%22%24lte%22%3A59263%7D%7D%5D%7D&projection=%7B%22classes%22%3A%7B%22_error%22%3Atrue%2C%22_revision%22%3Atrue%2C%22_version%22%3Atrue%7D%2C%22sbc%22%3A%7B%22_error%22%3Atrue%2C%22_revision%22%3Atrue%2C%22_version%22%3Atrue%2C%22blockCount%22%3Atrue%2C%22blockPCU%22%3Atrue%2C%22blockTime%22%3Atrue%2C%22componentTime%22%3Atrue%2C%22flagsGreen%22%3Atrue%2C%22flagsRed%22%3Atrue%2C%22flagsYellow%22%3Atrue%2C%22gridSize%22%3Atrue%2C%22ingotTime%22%3Atrue%2C%22oreVolume%22%3Atrue%7D%2C%22steam%22%3A%7B%22_error%22%3Atrue%2C%22_thumbName%22%3Atrue%2C%22_updated%22%3Atrue%2C%22_version%22%3Atrue%2C%22author%22%3Atrue%2C%22collections%22%3Atrue%2C%22flagsGreen%22%3Atrue%2C%22flagsRed%22%3Atrue%2C%22flagsYellow%22%3Atrue%2C%22id%22%3Atrue%2C%22postedDate%22%3Atrue%2C%22ratingCount%22%3Atrue%2C%22ratingStars%22%3Atrue%2C%22revision%22%3Atrue%2C%22subscriberCount%22%3Atrue%2C%22title%22%3Atrue%2C%22updatedDate%22%3Atrue%7D%2C%22thumb%22%3A%7B%22_error%22%3Atrue%2C%22_revision%22%3Atrue%2C%22_version%22%3Atrue%2C%22webp%22%3Atrue%7D%7D&sort=%7B%22subscriberCount%22%3A-1%7D&limit=12'>Querry "Fighter, vanilla" filter with only some data points</MyLink></li>
                    </ol>
                </Typography>
                <Typography paragraph>
                    Also, for advanced filter options see "Advanced" in filter's sidebar.
                    It's possible to define a lot more than by using "Custom" filter controls!
                </Typography>
            </FaqItem>
        </InfoCard>
    )
})) /* ============================================================================================================= */
