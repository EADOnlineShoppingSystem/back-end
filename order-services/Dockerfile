# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install any dependencies defined in package.json
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Expose the port your app runs on (replace 3000 with your port, if needed)
EXPOSE 5001

# Define environment variables for Cloudinary and MongoDB URI
ENV PORT=5001
ENV MONGODB_URI=mongodb+srv://udayanga:udayanga@udayanga.yebyk.mongodb.net/oder
ENV JWT_SECRET=kdm@#83jaKMDn22#3nvaCMq@!&mnskd832mvnaksd#


# Command to run your app (npm run dev in your case)
CMD ["npm", "run", "dev"]
