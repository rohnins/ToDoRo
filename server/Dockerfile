FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY server/package*.json ./
RUN npm install
RUN npm rebuild better-sqlite3
COPY server/ .
# CREATE DATA DIRECTORY (after copying files)
RUN mkdir -p /app/data
EXPOSE 5000
CMD ["npm", "run", "dev"]