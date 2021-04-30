import * as JSZip from 'https://cdn.skypack.dev/jszip@3.1.7?dts'


export const unzipCachedSbc = async (archiveRaw: Uint8Array): Promise<string> => {
    const archive = await JSZip.loadAsync(archiveRaw)
    const fileNames = Object.keys(archive.files)
    const sbcFilename = fileNames.find((filename) => filename.includes('.sbc'))
    if(sbcFilename === undefined) throw new Error(`No *.sbc file found within the archive.`)

    return archive.file(sbcFilename).async('string')
}
