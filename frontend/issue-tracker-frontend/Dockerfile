# Stage 1: Build Angular
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Angular 17 output folder:
COPY --from=build /app/dist/issue-tracker-frontend/browser /usr/share/nginx/html

EXPOSE 80
