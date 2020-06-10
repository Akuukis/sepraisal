import { writeFileSync } from 'fs'
import { join } from 'path'

import { data } from './generate-markdown'

const columns = [
    ['#',               '----:'],
    ['Subscribers',     '----:'],
    ['Ships/Total',     ':---:'],
    ['Title',           '-----'],
    ['Authors',         '-----'],
]

const header = `[tr] ${columns.map(([heading]) => `[th]${heading}[/th]`).join('')} [/tr]`
const rows = data
    .slice(0, 25)
    .map((datum, i) => `[tr][td]${[
            i+1,
            datum.subs,
            datum.amount === datum.total ? datum.amount : `${datum.amount}/${datum.total}`,
            `[url=https://steamcommunity.com/sharedfiles/filedetails/?id=${datum._id}]${datum.title}[/url]`,
            datum.authors
                .filter((author) => !!author.title)
                .map((author) => `[url=https://steamcommunity.com/${author.id}]${author.title}[/url]`).join(', '),
        ].join('[/td][td]')}[/td][/tr]`
    )

const result = [
    '[table]',
    header,
    ...rows,
    '[/table]',
    '',
].join('\n')

writeFileSync(join(__dirname, 'dist-steam.txt'), result)
