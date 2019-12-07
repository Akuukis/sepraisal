import { Stream } from 'stream'
import * as unzip from 'unzip'


interface IArchiveResult {
    blueprint: string,
    thumb: Buffer
}
export const parseSteamArchive = async (readStream: Stream): Promise<IArchiveResult> => {
    const result: Partial<IArchiveResult> = {}

    return (new Promise<IArchiveResult>((resolve, reject) => {
        readStream
            .on('error', reject)
            .pipe(unzip.Parse())
                .on('entry', (entry: unzip.Entry) => {
                    try {
                        const fileName = entry.path
                        const chunks: Buffer[] = []

                        entry.on('data', (chunk: Buffer) => {
                            chunks.push(chunk)
                        })

                        entry.on('end', () => {
                            if(fileName.endsWith('.sbc')) {
                                result.blueprint = Buffer.concat(chunks).toString()
                            } else {
                                result.thumb = Buffer.concat(chunks)
                            }
                        })
                    } catch(err) {
                        reject(err)
                    }
                })
                .on('error', reject)
                .on('close', () => {
                    resolve(result as IArchiveResult)
                })
    }))

}
