const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const server = new Koa()
const router = new Router()

router.get('/api', async ctx => {
  console.log('this will do some kind of api request')
  ctx.status = 200
  ctx.body = 'Listen very carefully, I shall say this only once!'
  return true
})

router.get('*', async ctx => {
  await handle(ctx.req, ctx.res)
  ctx.respond = false
})

server.use(async (ctx, next) => {
  ctx.res.statusCode = 200
  await next()
})

server.use(router.routes())

process.env.NODE_ENV !== 'test' && app.prepare().then(() => {
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})

module.exports = server
