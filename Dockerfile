# Stage 1: Build with Node 10 (compatible with Angular CLI 1.7)
FROM node:10-buster AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
# Ensure local CLI binary is available; fallback to global
RUN ./node_modules/.bin/ng version || npm install -g @angular/cli@1.7.2
RUN ./node_modules/.bin/ng build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]