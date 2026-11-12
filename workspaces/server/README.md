# SEPraisal Server

SEPraisal Server serves praisals to [SEPraisal App](../app/README.md).

SEPraisal Server takes them from a database, that is populated by [SEPraisal Crawler](../crawler/README.md).

To initialize the database collection and text search indexes, run `yarn initdb`.
For an existing database that already has the `blueprints` collection, `yarn reindex` also works.

There are two ways to "save" the database:
- dump: several GBs of mongodb specific blob, that contains all data. Dump, restore, and you're good to go!
- backup: several MBs of JSON, that contains 130k+ IDs only because Steam won't let to discover beyond 70k items. The rest can be regenerated.


## Setup on Debian 13

Automated setup from the repo root:

```sh
sudo bash ./workspaces/server/utils/setup-debian13.sh --force-bookworm-mongodb-repo
```

As of March 29, 2026, MongoDB's official Debian install docs list Debian 12 for `mongodb-org` 8.0, not Debian 13. The setup script therefore requires `--force-bookworm-mongodb-repo` to configure MongoDB on Debian 13, or `--skip-mongodb` if MongoDB is already installed.

```sh
## Install git
sudo apt-get update
sudo apt-get install -y git
git --version

## Install Node.js and Corepack.
## Debian 13 ships a modern Node.js; install it system-wide so systemd can see it.
sudo apt-get install -y nodejs npm
node --version

## Enable Yarn via Corepack (preferred on Debian 13).
sudo corepack enable
yarn --version

## Install MongoDB using the current Debian repository instructions from MongoDB.
## As of 2026-03-29, the official MongoDB 8.0 Debian page lists Debian 12.
## On Debian 13, either use the setup script with --force-bookworm-mongodb-repo
## or install MongoDB separately and skip it in the script.
sudo apt-get install -y mongodb-org
mongod --version

## Start MongoDB
sudo systemctl daemon-reload
sudo systemctl enable --now mongod
sudo systemctl status mongod



## Init repo
sudo useradd --system --create-home --home-dir /srv/sepraisal --shell /usr/sbin/nologin sepraisal
sudo -u sepraisal git clone https://github.com/Akuukis/sepraisal.git /srv/sepraisal
cd /srv/sepraisal
sudo -u sepraisal yarn install
sudo -u sepraisal yarn build


## Index the database
cd /srv/sepraisal/workspaces/server
sudo -u sepraisal cp .env.example .env
sudo -u sepraisal yarn initdb

## Test server
cd /srv/sepraisal/workspaces/server
sudo -u sepraisal yarn start

## Create service for server
cd /srv/sepraisal/workspaces/server
sudo -u sepraisal chmod +x utils/start.sh
sudo install -m 0644 sepraisal.service /etc/systemd/system/sepraisal.service
sudo install -d /etc/default
# change /srv/sepraisal here if you deploy the repo somewhere else
printf "SEPRAISAL_ROOT=/srv/sepraisal\n" | sudo tee /etc/default/sepraisal
sudo systemctl daemon-reload
sudo systemctl enable --now sepraisal
sudo systemctl status sepraisal
# if it doesn't work, use `sudo journalctl -u sepraisal -f`.
```
