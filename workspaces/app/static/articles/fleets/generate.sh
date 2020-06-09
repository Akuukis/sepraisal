MY_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )  # https://stackoverflow.com/questions/24112727/relative-paths-based-on-file-location-instead-of-current-working-directory
OUT="$MY_DIR/data.json"
PORT=27019

# ## Open tunnel to MongoDB using "sepraisal" credentials.
(ssh -NL $PORT:localhost:27017 sepraisal) &
sleep 1

mongo --port $PORT --quiet "$MY_DIR/mongo.js" > $OUT

kill %1  # Close the tunnel (job no.1, created with "&" symbol.)


## Formatting.
sed -ri ':a;N;$!ba;s/\n\t\t/ /g' $OUT  # collapse row values..
sed -ri ':a;N;$!ba;s/\n\t}/}/g' $OUT   # .. collapse closing } too.
sed -ri 's/"\ :/":/g' $OUT  # remove space between " and :
sed -ri 's/ \t(\t)?/ /g' $OUT  # remove redundant space at authors.

yarn run ts-node "$MY_DIR/generate-markdown.ts"
yarn run ts-node "$MY_DIR/generate-steam.ts"
