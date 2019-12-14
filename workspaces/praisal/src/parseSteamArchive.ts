import { Stream } from 'stream'
import * as unzip from 'unzip'


export const parseSteamArchive = async (readStream: Stream): Promise<string> => {
    let result: string

    return (new Promise<string>((resolve, reject) => {
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
                                result = Buffer.concat(chunks).toString()
                            }
                        })
                    } catch(err) {
                        reject(err)
                    }
                })
                .on('error', reject)
                .on('close', () => {
                    resolve(result)
                })
    }))

}
