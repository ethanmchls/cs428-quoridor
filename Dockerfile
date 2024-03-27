# Use an official Node.js runtime as a base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY app/package*.json ./

# Install app dependencies
RUN npm install

# Copy the application files to the container
COPY /app .

# Build the app
RUN npm run build


WORKDIR /usr/src/back-end

COPY back-end/package*.json ./

RUN npm install

COPY /back-end .

ENV PUBLIC_DIR="/usr/src/app/build"


# Expose the port the app runs on
EXPOSE 3001

# Define the command to run your app
CMD ["npm", "run", "start"]
