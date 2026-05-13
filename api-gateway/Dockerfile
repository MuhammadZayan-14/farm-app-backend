# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose gateway port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]