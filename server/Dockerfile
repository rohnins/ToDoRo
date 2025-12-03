FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY server/package*.json ./
RUN npm install
RUN npm rebuild better-sqlite3

# CREATE DATA DIRECTORY
RUN mkdir -p /app/data

COPY server/ .

EXPOSE 5000
CMD ["npm", "run", "dev"]