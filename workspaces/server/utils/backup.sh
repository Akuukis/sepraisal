MY_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )  # https://stackoverflow.com/questions/24112727/relative-paths-based-on-file-location-instead-of-current-working-directory
OUT="$MY_DIR/backup.json"
PORT=27019

# ## Open tunnel to MongoDB using "sepraisal" credentials.
(ssh -NL $PORT:localhost:27017 sepraisal) &
sleep 1

mongo --username $MONGO_USER --password $MONGO_PASSWORD  --port $PORT --quiet "$MY_DIR/backup.js" > $OUT

kill %1  # Close the tunnel (job no.1, created with "&" symbol.)
