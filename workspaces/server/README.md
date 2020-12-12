# SEPraisal Server

SEPraisal Server serves praisals to [SEPraisal App](../app/README.md).

SEPraisal Server takes them from a database, that is populated by [SEPraisal Crawler](../crawler/README.md).

To enable text search and faster queries, run `yarn reindex`.

There are two ways to "save" the database:
- dump: several GBs of mongodb specific blob, that contains all data. Dump, restore, and you're good to go!
- backup: several MBs of JSON, that contains 130k+ IDs only because Steam won't let to discover beyond 70k items. The rest can be regenerated.
