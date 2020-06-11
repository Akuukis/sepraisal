import { readFileSync, writeFileSync } from 'fs'
import moment from 'moment'
import { join } from 'path'

import dataRaw from './data.json'

interface Author {
    id: string,
    title: string,
}
interface Datum {
    _id: number,
    subs: number,
    updated: string,
    amount: number,
    total: number,
    smallGrid: number,
    largeGrid: number,
    atmo: number,
    hydro: number,
    ion: number,
    wheel: number,
    dlc: number,
    script: number,
    title: string,
    authors: Author[]
}
export const data = dataRaw as Datum[]

const columns = [
    ['#',                   '----:'],
    ['Steam sub., avg.',    '----:'],
    ['Title',               '-----'],
    ['Updated, avg.',       '----:'],
    ['Ships / Total',       ':---:'],
    ['Large Grid',          '----:'],
    ['DLC',                 '----:'],
    ['PB',                  '----:'],
    ['Atmo.',               '----:'],
    ['Hydro.',              '----:'],
    ['Ion',                 '----:'],
    ['Wheel',               '----:'],
    ['Authors',             '-----'],
]

const header = `| ${columns.map(([heading]) => heading).join('|')} |`
const alignment = `| ${columns.map(([_, align]) => align).join('|')} |`
const rows = data.map((datum, i) => [
    '',
    i+1,
    `[${datum.subs}](https://steamcommunity.com/sharedfiles/filedetails/?id=${datum._id})`,
    `[${datum.title.replace('|', '\\|')}](https://spaceengineerspraisal.net/browse?collection=${encodeURIComponent(datum.title)})`,
    moment(datum.updated).format(`MMM,\u00A0YYYY`),
    datum.amount === datum.total ? datum.amount : `${datum.amount}/${datum.total}`,
    datum.largeGrid === 0 ? '-' : `${Math.round(datum.largeGrid*100)}%`,
    datum.dlc === 0 ? '-' : `${Math.round(datum.dlc*100)}%`,
    datum.script === 0 ? '-' : `${Math.round(datum.script*100)}%`,
    datum.atmo === 0 ? '-' : `${Math.round(datum.atmo*100)}%`,
    datum.hydro === 0 ? '-' : `${Math.round(datum.hydro*100)}%`,
    datum.ion === 0 ? '-' : `${Math.round(datum.ion*100)}%`,
    datum.wheel === 0 ? '-' : `${Math.round(datum.wheel*100)}%`,
    datum.authors
        .filter((author) => !!author.title)
        .map((author) =>
            `[${author.title.replace('|', '\\|')}](https://spaceengineerspraisal.net/browse?author=${encodeURIComponent(author.title)})`
        ).join(', '),
    '',
].join('|'))

const result = [
    readFileSync(join(__dirname, 'fleets-table-header.md')).toString()
        .replace('__COUNT__', String(rows.length)),
    header,
    alignment,
    ...rows,
    '',
].join('\n')

writeFileSync(join(__dirname, 'fleets.md'), result)
