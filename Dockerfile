# Preparamos la build
# las dependencias y construimos la app para producción

# Descargamos las dependencias de desarrollo
FROM node:16-alpine as dependencies
RUN mkdir /tmp/dev
COPY package.json /tmp/dev/package.json
COPY package-lock.json /tmp/dev/package-lock.json
RUN cd /tmp/dev && npm install
RUN mkdir -p /usr/dev && cp -a /tmp/dev/node_modules /usr/dev/
COPY package.json /tmp/prod/package.json
COPY package-lock.json /tmp/prod/package-lock.json
RUN cd /tmp/prod && npm install --omit=dev
RUN mkdir -p /usr/app && cp -a /tmp/prod/node_modules /usr/app/

# Copiamos los archivos del repo y buildeamos.
FROM dependencies AS BUILD_IMAGE
WORKDIR /usr/dev
COPY package*.json ./
COPY . .
RUN npx prisma generate
RUN npm run build
RUN rm -rf node_modules

# Preparamos el servidor de producción ahora
FROM dependencies
ENV NODE_ENV production
WORKDIR /usr/app
COPY --from=BUILD_IMAGE	/usr/dev/package.json	./
COPY --from=BUILD_IMAGE /usr/dev/package-lock.json ./
COPY --from=BUILD_IMAGE /usr/dev/public ./public
COPY --from=BUILD_IMAGE /usr/dev/dist ./dist
COPY --from=BUILD_IMAGE /usr/dev/.env ./.env
COPY --from=BUILD_IMAGE /usr/dev/.next ./.next
COPY --from=BUILD_IMAGE /usr/dev/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=BUILD_IMAGE /usr/dev/prisma/seed.ts ./prisma/seed.ts
RUN npx prisma generate
# Exponemos la imagen en un puerto
EXPOSE 3000
# Indicamos que se ejecutará al montarlo en un contenedor
CMD [ "npm", "run", "start:prod" ]


