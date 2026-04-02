# Base image
FROM node:20-alpine

# Workdir
WORKDIR /app

# Copy package
COPY package*.json ./

# Install deps
RUN npm install

# Copy code
COPY . .

# Expose port
EXPOSE 3001

# Start
CMD ["npm", "start"]