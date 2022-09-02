FROM node:16-alpine as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:16-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN apk update
RUN apk add
RUN apk add ffmpeg
RUN yarn install --production --frozen-lockfile
COPY --from=builder /usr/src/app/build ./build
EXPOSE 3000
CMD ["node", "build/index.js"]
