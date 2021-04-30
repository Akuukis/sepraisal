/**
 * Not the best config, but as close to xml2js as possible.
 */
export const PARSE_CONFIG = {
    attributeNamePrefix: '',
    attrNodeName: '$',
    ignoreAttributes: false,
    arrayMode: (tagName: string): boolean => tagName !== '$',
}
