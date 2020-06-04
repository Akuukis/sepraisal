import { writeFileSync } from 'fs'
import { join } from 'path'

import dataRaw from './data.json'

interface Author {
    id: string,
    title: string,
}
interface Datum {
    _id: number,
    subs: number,
    amount: number,
    total: number,
    smallGrid: number,
    largeGrid: number,
    atmo: number,
    hydro: number,
    ion: number,
    wheel: number,
    title: string,
    authors: Author[]
}
export const data = dataRaw as Datum[]

const columns = [
    ['#',                   '----:'],
    ['Subscribers (avg)',   '----:'],
    ['Ships/Total',         ':---:'],
    ['Title',               '-----'],
    ['Large Grid',          '----:'],
    ['Atmo.',               '----:'],
    ['Hydro.',              '----:'],
    ['Ion',                 '----:'],
    ['Wheeled',             '----:'],
    ['Authors',             '-----'],
]

const header = `| ${columns.map(([heading]) => heading).join('|')} |`
const alignment = `| ${columns.map(([_, align]) => align).join('|')} |`
const rows = data.map((datum, i) => [
    '',
    i+1,
    datum.subs,
    datum.amount === datum.total ? datum.amount : `${datum.amount}/${datum.total}`,
    [
        `[${datum.title}](https://spaceengineerspraisal.net/browse?collection=${encodeURIComponent(datum.title)})`,
        `([steam](https://steamcommunity.com/sharedfiles/filedetails/?id=${datum._id}))`
    ].join(' '),
    datum.largeGrid === 0 ? '-' : `${Math.round(datum.largeGrid*100)}%`,
    datum.atmo === 0 ? '-' : `${Math.round(datum.atmo*100)}%`,
    datum.hydro === 0 ? '-' : `${Math.round(datum.hydro*100)}%`,
    datum.ion === 0 ? '-' : `${Math.round(datum.ion*100)}%`,
    datum.wheel === 0 ? '-' : `${Math.round(datum.wheel*100)}%`,
    datum.authors.map((author) =>
        `[${author.title.replace('|', '\\|')}](https://spaceengineerspraisal.net/browse?author=${encodeURIComponent(author.title)})`
    ).join(', '),
    '',
].join('|'))

const result = [
    header,
    alignment,
    ...rows,
].join('\n')

writeFileSync(join(__dirname, 'fleets-table.md'), result)
