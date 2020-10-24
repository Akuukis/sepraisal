
# ## Open tunnel to MongoDB using "sepraisal" credentials.
# PORT=27019
# (ssh -NL $PORT:localhost:27017 sepraisal) &
# sleep 1

mongodump --port $PORT

# kill %1  # Close the tunnel (job no.1, created with "&" symbol.)
