import JSZip from 'jszip'

export const unzipCachedSbc = async (archiveBuffer: Buffer, sbcFilename: string): Promise<string> => {
    const archive = await JSZip.loadAsync(new Uint8Array(archiveBuffer))
    const file = archive.file(sbcFilename)
    if (!file) {
        throw new Error(`File ${sbcFilename} not found in archive`)
    }
    return file.async('string')
}