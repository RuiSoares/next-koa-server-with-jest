const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fetch = require('node-fetch')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const server = new Koa()
const router = new Router()

// End point that returns a string.
router.get('/api', async ctx => {
  ctx.status = 200
  ctx.body = 'Listen very carefully, I shall say this only once!'
  return true
})

// End point that sets a cookie with a given name
router.post('/cookies', async ctx => {
  const { body } = ctx.request
  ctx.cookies.set('name', body.name);
  ctx.status = 200
  ctx.body = 'Nom nom nom!'
  return true
})

// End point that calls another API
router.post('/forward', async ctx => {
  await fetch('https://jsonplaceholder.typicode.com/todos/1', {
    method: 'GET',
  })
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText)
      }
      ctx.status = 200
      ctx.body = res.body
      return true
    })
    .catch((err) => {
      ctx.status = 500
      ctx.body = 'Internal Server Error'
      return true
    })
})

router.get('*', async ctx => {
  await handle(ctx.req, ctx.res)
  ctx.respond = false
})

server.use(async (ctx, next) => {
  ctx.res.name = ctx.cookies.get('name') || 'chips ahoy'
  ctx.res.statusCode = 200
  await next()
})

server.use(bodyParser())
server.use(router.routes())

process.env.NODE_ENV !== 'test' && app.prepare().then(() => {
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
  // Routes:
  console.log(router.stack.map((i) => i.path))
})

module.exports = server
