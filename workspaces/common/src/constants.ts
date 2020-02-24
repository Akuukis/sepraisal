//            semver = 000.000.002
export const VERSION =           2
export const DB_URL = String(process.env.db_url)
export const DB_NAME = 'default'

export const SERVICE_DESK_EMAIL = 'incoming+akuukis-sepraisal-7683681-issue-@incoming.gitlab.com'
export const MATOMO_PARAMS = {
    // TODO: Do not hardcode this.
    siteId: 1,
    url: '//kalvis.lv/piwik/',
} as const
