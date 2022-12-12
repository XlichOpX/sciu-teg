# Preparamos la build
# las dependencias y construimos la app para producción
FROM node:16-alpine AS BUILD_IMAGE
RUN mkdir -p /usr/app/
WORKDIR /usr/app
COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig*.json ./
COPY . .
RUN npm install
RUN npm run build
RUN rm -rf node_modules
RUN npm install --omit=dev
RUN npx prisma generate

# Preparamos el servidor de producción ahora
FROM node:16-alpine
ENV NODE_ENV production
RUN mkdir -p /usr/app/
WORKDIR /usr/app
COPY --from=BUILD_IMAGE	/usr/app/node_modules	./node_modules
COPY --from=BUILD_IMAGE	/usr/app/package.json	./
COPY --from=BUILD_IMAGE /usr/app/package-lock.json ./
COPY --from=BUILD_IMAGE /usr/app/public ./public
COPY --from=BUILD_IMAGE /usr/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/app/.env ./.env
COPY --from=BUILD_IMAGE /usr/app/.next ./.next
COPY --from=BUILD_IMAGE /usr/app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=BUILD_IMAGE /usr/app/prisma/seed.ts ./prisma/seed.ts
# Exponemos la imagen en un puerto
EXPOSE 3000
# Indicamos que se ejecutará al montarlo en un contenedor
CMD [ "npm", "run", "start:prod" ]


