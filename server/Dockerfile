FROM node:20-alpine

WORKDIR /app

# Install Python and build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY server/package*.json ./
RUN npm install

# Rebuild better-sqlite3 for the container environment
RUN npm rebuild better-sqlite3

COPY server/ .

EXPOSE 5000

CMD ["npm", "run", "dev"]