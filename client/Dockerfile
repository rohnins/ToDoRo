FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
ENV CHOKIDAR_USEPOLLING=false
EXPOSE 3000
CMD ["npm", "start"]