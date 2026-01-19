FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g tsx

COPY . .

# Copy and set executable permission for entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
