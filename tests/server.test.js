const server = require('../server')
const request = require('supertest')


describe('Test for our custom Koa server', () => {
  let httpServer

  beforeAll(() => {
    httpServer = request.agent(server.callback())
  })

  it('serves the Next.js app', async (done) => {
    httpServer.get('/api').expect(200, 'Listen very carefully, I shall say this only once!').end(done);
  })
})
