# SEPraisal Server

SEPraisal Server serves praisals to [SEPraisal App](../app/README.md).

SEPraisal Server takes them from a database, that is populated by [SEPraisal Crawler](../crawler/README.md).

To enable text search and faster queries, run `yarn reindex`.

There are two ways to "save" the database:
- dump: several GBs of mongodb specific blob, that contains all data. Dump, restore, and you're good to go!
- backup: several MBs of JSON, that contains 130k+ IDs only because Steam won't let to discover beyond 70k items. The rest can be regenerated.


## Setup

```sh
## Install git
# TODO
git --version  # 2.25.1

## Install Node v12
# TODO
node --version  # v12.19.0

## Install Yarn
# TODO
yarn --version  # 1.22.5

## Install MongoDB - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
mongod --version  # v4.4.3
mongo --version  # v4.4.3

## Start MongoDB
sudo systemctl daemon-reload
sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl enable mongod



## Init repo
git clone https://github.com/Akuukis/sepraisal.git
cd sepraisal
yarn
yarn build


## Index the database
cd workspaces/server
cp .env.exaxmple .env
yarn reindex
```
