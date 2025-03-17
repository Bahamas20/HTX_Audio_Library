# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app
RUN npm install

# Copy the rest of the frontend files into the container
COPY . /app

# Expose the port the app will run on
EXPOSE 3000

# Run the frontend React app
CMD ["npm", "start"]
