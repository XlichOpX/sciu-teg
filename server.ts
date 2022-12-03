//server.ts
import { createServer } from 'http'
import next from 'next'
import { parse } from 'url'
import scheduleConversionTask from './cron/scheduleConversionTask'
import scheduleUpdateTask from './cron/scheduleUpdateTask'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const app = next({
  dev,
  hostname,
  port,
  customServer: true,
  conf: {
    reactStrictMode: true,
    swcMinify: true
  }
})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      if (!req.url) return
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, () => {
    console.log(`IUJO CAJA <${dev ? 'Desarrollo' : 'Producción'}> -> http://${hostname}:${port}`)
    try {
      scheduleUpdateTask('0 14 16 */ *')
      scheduleConversionTask('0 08 */ * *')
    } catch (error) {
      console.log({ error })
    }
  })
})
