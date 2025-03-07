# Use an official Node 18 runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (Vite typically uses 5173 by default)
EXPOSE 3000

# Start the Vite development server
CMD ["npm", "run", "dev"]
