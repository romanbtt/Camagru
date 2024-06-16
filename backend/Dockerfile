
# Use a base image
FROM node:alpine

# Set the working directory
WORKDIR /usr/src/app

# Set the NODE_ENV to development
ENV NODE_ENV=${MODE}

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

COPY entrypoint.sh /usr/src/app/entrypoint.sh

RUN chmod +x /usr/src/app/entrypoint.sh

# Expose the port your backend will be running on
EXPOSE 3000

RUN npx prisma generate
# RUN npx prisma db 

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

# Define the command to start your backend
CMD npm run start:${MODE}