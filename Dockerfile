# Preparamos la build
# las dependencias y buildear
FROM node:16-alpine AS BUILD_IMAGE
# creamos donde se trabajaría con esta imagen
RUN mkdir -p /usr/app/
WORKDIR /usr/app
# Copiamos todo lo del repositorio al workdir
COPY . .
# Instalamos las dependencias de desarrollo y compilamos el servidor
RUN npm install
RUN npm run build
# Eliminamos las dependencias e instalamos las dependencias de producción
RUN rm -rf node_modules
RUN npm install --omit=dev

# Preparamos el servidor de producción ahora
FROM node:16-alpine
ENV NODE_ENV production
ENV HOSTNAME localhost
RUN mkdir -p /usr/app/
WORKDIR /usr/app
COPY --from=BUILD_IMAGE /usr/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE	/usr/app/package.json	./
COPY --from=BUILD_IMAGE /usr/app/package-lock.json ./
COPY --from=BUILD_IMAGE /usr/app/public ./public
COPY --from=BUILD_IMAGE /usr/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/app/.next ./.next
COPY --from=BUILD_IMAGE /usr/app/.env ./.env
# Exponemos la imagen en un puerto
EXPOSE 3000
# Indicamos que se ejecutará al montarlo en un contenedor
CMD [ "npm", "run", "start:prod" ]
