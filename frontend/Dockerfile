FROM oven/bun:latest

WORKDIR /app

COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
