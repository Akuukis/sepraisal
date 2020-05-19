import { readdirSync } from 'fs'
import { join } from 'path'

(async () => {

    const routineNo = process.argv[2]
    const routinePath = readdirSync(join(__dirname, 'routines'))
        .filter((filename) => filename.includes('-'))
        .filter((filename) => filename.slice(-3) === __filename.slice(-3))  // ts looks for ts, js looks for js.
        .find((filename) => filename.includes(routineNo))
    if(routinePath === undefined) throw new Error('No routine specified as first argument!')

    console.info(new Date(), `Loading routine "${routinePath}"...`)
    // tslint:disable-next-line: ban
    const routine = require(join(__dirname, 'routines', routinePath)) as {main(): Promise<unknown>}
    console.info(new Date(), `Executing routine "${routinePath}"...`)
    await routine.main()
    console.info(new Date(), `Done!`)

})().catch((err) => {
    console.error(new Date(), err)
})
