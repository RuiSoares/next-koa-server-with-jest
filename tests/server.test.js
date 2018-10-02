const request = require('supertest')
const nock = require('nock')

const server = require('../server')


describe('Test for our custom Koa server', () => {
  let api

  beforeAll(() => {
    api = request.agent(server.callback())
  })

  describe('Simple API request', async () => {
    it('Returns 200', async (done) => {
      api.get('/api').expect(200, 'Listen very carefully, I shall say this only once!').end(done);
    })
  })

  describe('Header changing API request', async () => {
    it('Returns 200 with changed header', async (done) => {
      api.post('/cookies')
        .send({name: 'oreo'})
        .set('Accept', 'application/json')
        .expect(200).end(
        (err, res) => {
          if (err) return done(err);

          expect(res.header['set-cookie']).toContain('name=oreo; path=/; httponly')

          return done();
        }
      )
    })
  })

  describe('Stub request done by API request', async () => {
    beforeAll(() => {
      nock('https://jsonplaceholder.typicode.com')
      .get('/todos/1')
      .reply(200);
    })

    it('Returns 200', async (done) => {
      api.post('/forward').expect(200).end(done);
    })
  })
})
