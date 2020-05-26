# https://stackoverflow.com/questions/24112727/relative-paths-based-on-file-location-instead-of-current-working-directory
MY_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
OUT="$MY_DIR/../static/collections.data"

mongo --port 27018 --quiet "$MY_DIR/generateCollections.js" > $OUT
sed -ri ':a;N;$!ba;s/\n\t\t/ /g' $OUT  # collapse row values..
sed -ri ':a;N;$!ba;s/\n\t}/}/g' $OUT   # .. collapse closing } too.
sed -ri 's/"\ :/":/g' $OUT  # remove space between " and :
