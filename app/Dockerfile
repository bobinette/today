# This Dockerfile as well as docker-nginx.conf were taken from
# http://mherman.org/blog/2017/12/07/dockerizing-a-react-app/#.WsubodNuYWo

# build environment
FROM node:9.8.0 as builder
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy only package.json so the npm install is cached
COPY package.json /usr/src/app/package.json
RUN npm install

# Now copy the rest of the sources
COPY ./src /usr/src/app/src
COPY ./webpack /usr/src/app/webpack
COPY ./.babelrc /usr/src/app/.babelrc

# Build the thing
RUN npm run build:docker

# production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
