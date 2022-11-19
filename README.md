# TEG - University collection management system

_**By** Yhan Montaño & Reynaldo González_

This system seeks to solve the collection needs of students and third parties of a university that offers monthly enrolled courses and courses to people other than students.
In the same way presented as a degree thesis from the Jesús Obrero University Institute (IUJO)

Realize with:

- ChakraUI 2.2.8
- Crypto.js 4.1.1
- Day.js 1.11.5
- esLint 8.22.0
- Iron-Session 6.2.1
- Just-debounce 1.1.0
- lodash 4.17.21
- NextJS 12.2.5
- PostgreSQL 14
- Prettier 2.7.1
- Prisma 4.2.1
- React 18.2.0
- Sheet.js 0.19.0
- SWR 1.3.0
- TypeScript 4.7.4
- Zod 3.18.0
  and using faker-js 7.5.0 for create fake initial seeder data

Among its features are:

- [x] Automate collect from Spread Sheets
- [x]

## Getting Started

### work up the project in local environment

First, clone the repository by http or gh cli:

```bash
git clone https://github.com/XlichOpX/sciu-teg.git
```

or

```bash
gh repo clone XlichOpX/sciu-teg
```

Second, run the install dependencies:

```bash
cd /sciu-teg
npm install
```

Third, create and configure `.env` file

```bash
NODE_ENV = "development"

SECRET=<SECRET_PHRASE> #this is for CryptoJS encrypting
DATABASE_URL="postgresql://<db_username>:<db_password>@<db_host_server>:<db_port>/<db_name>?schema=<db_schema>"

SESSION_PASSWORD = <SECRET_PHRASE> #this is for iron-session
```

After this, you need create or have db credentials that use in url connection.
And make the push database schema from local db.

```bash
npx prisma db push
```

As well ur can use the seeder to create first records in db usable.

```bash
npx prisma db seed
```

Once this is done it should be enough to start the project with

```bash
npm run dev
```

### Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
