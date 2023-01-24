# TEG - Sistema de Gestión de Cobranzas

_**Por** [Yhan Montaño](https://github.com/XlichOpX) & [Reynaldo González](https://github.com/kurokuro15)_

Presentamos el siguiente repositorio como proyecto de TEG para optar por el título de Técnico Superior en Informática

Este sistema busca solventar las necesidades de cobro de los estudiantes del Instituto Universitario Jesús Obrero (IUJO) así como permitir realizar cobros estudiantes de la Coordinación de Extensión Profesional (CEP).

### Realizado con:

- **ChakraUI** _2.2.8_
- **Crypto.js** _4.1.1_
- **Day.js** _1.11.5_
- **esLint** _8.22.0_
- **Iron-Session** _6.2.1_
- **Just-debounce** _1.1.0_
- **lodash** _4.17.21_
- **NextJS** _12.2.5_
- **PostgreSQL** _14_
- **Prettier** _2.7.1_
- **Prisma** _4.2.1_
- **React** _18.2.0_
- **Sheet.js** _0.19.0_
- **SWR** _1.3.0_
- **TypeScript** _4.7.4_
- **Zod** _3.18.0_
  además de usar **faker-js** _7.5.0_ para crear las pruebas iniciales del _seeder_ de prisma
  
##### Plataforma: 
**Node JS 16 LTS** bajo contenedores **Docker**
### Algunas de las características del sistema:

- [x] Importar cobros por lote a través de Hojas de Cálculo
- [x] Permitir enviar recibos a los estudiantes por correo con un solo clic
- [x] Configurar diferentes monedas, métodos de pago y conversiones asociadas
- [x] Reportar de forma precisa y sencilla las ventas según métodos de pago o categorías e incluso productos
- [x] Actualizar diariamente las conversiones en bolívares
- [x] Notificar mensualmente de estudiantes deudores y generación de cobros semestrales

## Levantar Proyecto

### Para trabajar en entorno de desarrollo

Precondición, debemos tener instalados NodeJS 16 LTS o superior y su respectiva versión de NPM

#### Primero

Clonamos el repositorio, utilizando el método HTTP, GitHub CLI o SSH:

```bash
git clone https://github.com/XlichOpX/sciu-teg.git
```

ó

```bash
gh repo clone XlichOpX/sciu-teg
```

#### Segundo

Instalamos las dependencias necesarias.

```bash
cd /sciu-teg
npm install
```

#### Tercero, Creamos o copiamos a partir de `.env.example` el archivo `.env` y lo configuramos

```bash
# .env file

# Definimos la base de datos, usuario, contraseña, host, puerto y schema a utilizar, generalmente schema=public
DATABASE_URL="postgresql://<db_username>:<db_password>@<db_host_server>:<db_port>/<db_name>?schema=<db_schema>&pool_timeout=0&connection_limit=20"

# Podemos no definir esta variable para ejecutar en modo desarrollo
NODE_ENV = "development" | "production"

# Este secreto es para utilizarlo como llave de encriptado, puede ser cualquier cadena de texto
SECRET=<SECRET_PHRASE>
# Igualmente, otra llave de encriptado, sin embargo utilizada por la lib iron-session, responsable de la generación de cookies y sistema de autenticación.
SESSION_PASSWORD = <SECRET_PHRASE>

# variables de entorno del nodemailer, la librería que permite enviar correos electrónicos. Podemos no usarlas y se activarán las de test automáticamente.
SMTP_HOST=<smtp host>
SMTP_PORT=<smtp port>
SMTP_USER=<mail address or user>
SMTP_PASS=<mail password>

# Dirección de correo electrónico para recibir notificaciones de las conversiones y deudas.
NOTIFICATION_MAIL=<Mail to give notification>

# Dominio donde estará desplegado el sistema
HOSTNAME=<DOMAIN_NAME>

# URL de la API donde consulta la tasa actualizada del valor del dolar en relación al bolivar.
CONVERSION_BOLIVAR_API_URL="https://bcv-api.deno.dev/v1/exchange"
```

#### Después de esto, necesitamos crear o tener las credenciales de base de datos que se usaron en la url.

Y añadir el schema de la base de dato usando el siguiente comando:

```bash
npx prisma db push
```

Así como podemos utilizar el siguiente comando también para agregar valores por defecto, incluso un usuario con todos los permisos

` usuario: admin`

`contraseña: password `

```bash
npx prisma db seed
```

Una vez realizado estos pasos, deberíamos tener todo listo para ejecutar desarrollo

```bash
npm run dev
```

### Abre [http://localhost:3000](http://localhost:3000) en tu navegador y accede al sistema.

## Usando Docker compose

Creamos en busca de disponer de un método rápido y fácil de presentar el sistema ante el jurado, la funcionalidad de crear una imagen del proyecto
y desplegar esta en un contenedor de docker.

### Pre-requisitos

Para poder ejecutar el proyecto en un contenedor debemos tener las siguientes herramientas en nuestro entorno de trabajo:

- [Docker](https://www.docker.com/) (_Windows, Linux o MacOS_)
- WSL 2 (en caso de tener _Windows_ como **OS** **anfitrión**)
- [Docker-compose](https://docs.docker.com/compose/install/) (Viene incluido con `Docker-Desktop`)

### Iniciando El proyecto con Docker

Realizaremos los [primeros pasos](#primero) de la misma manera, obtendremos el `repositorio`. Sin embargo no hace falta instalar node ni las dependencias.

En cambio, abriremos la terminal dentro del directorio.

En el directorio raíz veremos los archivos `docker-compose.yml` y `Dockerfile`
Accederemos al archivo `docker-compose.yml` y configuraremos tanto para `postgresito` como para `sciu-teg` la sección `environment:` con la información de su preferencia.

```yml
# docker-compose.yml
postgresito:
    environment:
      - POSTGRES_DB=<db_name>
      - POSTGRES_PASSWORD=<db_password>
      - POSTGRES_HOST_AUTH_METHOD=trust
sciu-teg:
  ...
  environment:
    - DATABASE_URL=postgresql://postgres:<db_password>@postgresito:3000/<db_name>?schema=public&pool_timeout=0&connection_limit=20
    - SECRET=<SECRET_PHRASE>
    - SESSION_PASSWORD=<SECRET_PHRASE>
    - SMTP_HOST=<smtp host>
    - SMTP_PORT=<smtp port>
    - SMTP_USER=<mail address or user>
    - SMTP_PASS=<mail password>
    - NOTIFICATION_MAIL=<mail address>
    - HOSTNAME=localhost
    - PORT=3000
    - CONVERSION_BOLIVAR_API_URL=https://bcv-api.deno.dev/v1/exchange
```

Una vez configurado estas variables de entorno para el archivo `docker-compose.yml` podemos proceder a levantar el contenedor.
Haciendo uso del siguiente comando:

```bash
#estando en la raíz del proyecto
docker compose up
```

Una ve realizado este comando, tardará un poco, ya que ha de descargar las imágenes de PostgreSQL y Node 16 bajo Linux Alpine, descargar las dependencias y construir la aplicación.

Para finalizar y tener datos que revisar, se ejecutará los siguientes comandos (una vez se termine de componer dicho contenedor quedará a la escucha de peticiones)
También puedes ejecutarlos desde la CLI de docker, simplemente usando `npx prisma db <arg>`

```bash
docker exec sciu-teg-sciu-teg-1 npx prisma db push
docker exec sciu-teg-sciu-teg-1 npx prisma db seed
```

con estos se esquematizará la base de datos y seguido de esto se generarán datos de prueba.

### Abre [http://localhost:3000](http://localhost:3000) en tu navegador y accede al sistema.

Este es un proyecto [Next.js](https://nextjs.org/) iniciado con [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

[Presentación en PowerPoint del Sistema](https://1drv.ms/p/s!AicWR-5fnmEYgaxENPkS5mmZ8aUlHQ?e=dWvTZl)
[Libro de Tesis Revisado](./resources/%5BTEG%5D%20-SCMAMIEIUJOCEP-%20Reynaldo%20%26%20Yhan.pdf)
