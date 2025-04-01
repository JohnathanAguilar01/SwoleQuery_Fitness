#!/bin/sh

# Check if the seeds have already been run
# if [ ! -f /app/database/.seeds_run ]; then
  echo "Running knex seeds..."
  npx knex seed:run --knexfile /app/database/knexfile.js
  # Create a marker file to indicate that seeds have been executed
  touch /app/database/.seeds_run
# else
#   echo "Seeds already run. Skipping seeding step."
# fi

# Optionally, start the application (or exit if this is a one-off seeder)
# npm start
