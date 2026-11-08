# Using an official node image
FROM node:24-alpine

WORKDIR /src

COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

COPY . .

# Create uploads directory and assign ownership
RUN mkdir -p /src/uploads \ 
    && chown -R node:node /src

# Run as a non-root user
USER node

EXPOSE 8080

# Start the server
CMD ["npm", "start"]