FROM node:22-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base as dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

FROM base as build
RUN npm run build

FROM nginx:alpine as prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
