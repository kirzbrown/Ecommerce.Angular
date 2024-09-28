##### Stage 1
FROM node:latest as node
LABEL author="Rafael C Tarce Jr."
WORKDIR /app
COPY nginx/id-local.crt /usr/local/share/ca-certificates/id-local.crt
RUN  update-ca-certificates
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install -g vsts-npm-auth --registry https://registry.npmjs.com --always-auth false

COPY spa/Ecommerce.SPA/ClientApp/package.json spa/Ecommerce.SPA/ClientApp/package-lock.json ./
COPY spa/Ecommerce.SPA/ClientApp/.npmrc  ./
RUN npm install --legacy-peer-deps
COPY spa/Ecommerce.SPA/ClientApp/ .
# Angular 12+ does a production build by default if you've enabled it using 
# ng update @angular/cli --migrate-only production-by-default
# https://github.com/angular/angular-cli/issues/21073#issuecomment-855960826
# RUN npm run build

# Prod build if production-by-default hasn't been enabled 
RUN npm run build -- --prod

##### Stage 2
FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=node /app/dist /usr/share/nginx/html
COPY spa/Ecommerce.SPA/ClientApp/config/nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
#EXPOSE 443
EXPOSE 44340

# docker build -t nginx-angular -f nginx.prod.dockerfile .
# docker run -p 8080:80 nginx-angular


