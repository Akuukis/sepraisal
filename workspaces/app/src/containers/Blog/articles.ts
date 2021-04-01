import moment from 'moment'

import { IBlogArticle } from 'src/common'

import postClassificationLink from '../../../static/articles/classification/classification.md'
import postFleetsDIYLink from '../../../static/articles/fleets/fleets-how.md'
import postFleetsTableLink from '../../../static/articles/fleets/fleets.md'
import postLaunch2Link from '../../../static/articles/launch2/launch2.md'
import lookingForNewServersLink from '../../../static/articles/looking-for-new-servers/looking-for-new-servers.md'
import newServerLink from '../../../static/articles/new-server/new-server.md'
import postTestLink from '../../../static/articles/test/test.md'


export const published: IBlogArticle[] = [
    {id: 'new-server', date: moment('2021-04-01'), link: newServerLink, authors: ['Akuukis'], title: 'New server found!'},
    {id: 'looking-for-new-host', date: moment('2020-10-24'), link: lookingForNewServersLink, authors: ['Akuukis'], title: 'Sad story: Looking for new servers'},
    {id: 'fleets', date: moment('2020-06-10'), link: postFleetsTableLink, authors: ['Akuukis'], title: 'Fleet Rankings v2'},
    {id: 'fleets-how', date: moment('2020-06-10'), link: postFleetsDIYLink, authors: ['Akuukis'], title: `Fleet Rankings v2: How it's made`},
    {id: 'launch2', date: moment('2020-06-03'), link: postLaunch2Link, authors: ['Akuukis'], title: 'SE Praisal V2 launched!'},
]

const hidden: IBlogArticle[] = [
    {id: 'classification', date: moment('2020-06-10'), link: postClassificationLink, authors: ['Akuukis'], title: 'Ship Classification'},
    {id: 'test', date: moment('2000-01-01'), link: postTestLink, authors: ['Test'], title: 'Test'},
]

export const articles = [...published, ...hidden]
