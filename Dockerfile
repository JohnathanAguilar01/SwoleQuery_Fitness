FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy your knex configuration and the database folder (with migrations/seeds)
COPY database ./database

# Copy the entrypoint script and make it executable
COPY seederentrypoint.sh /app/seederentrypoint.sh
RUN sed -i 's/\r$//' /app/seederentrypoint.sh && chmod +x /app/seederentrypoint.sh

# Set the entrypoint to run the script on container start
ENTRYPOINT ["/app/seederentrypoint.sh"]

# (Optional) If you want to keep the container running after seeding, you can add a CMD
# CMD ["npm", "start"]
