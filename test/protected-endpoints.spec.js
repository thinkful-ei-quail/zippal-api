const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe.only('Protected Endpoints', function() {
  let db

  const { testUsers, testConvos, testMessages } = helpers.makeTestFixtures()

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('seed tables', async () => {
    await helpers.seedUsers(db, testUsers)
    await helpers.seedConvos(db, testConvos)
    await helpers.seedMessages(db, testMessages)
  })

  const protectedEndpoints  = [
    {
      name: 'GET /api/conversation',
      path: '/api/conversation',
      method: supertest(app).get
    },
    {
      name: 'POST /api/conversation',
      path: '/api/conversation',
      method: supertest(app).post
    },
    {
      name: 'GET /api/conversation/find',
      path: '/api/conversation/find',
      method: supertest(app).get
    },
    {
      name: 'PATCH /api/conversation/:conversation_id',
      path: '/api/conversation/:conversation_id',
      method: supertest(app).patch
    },
    {
      name: 'POST /api/message',
      path: '/api/message',
      method: supertest(app).post
    },
    {
      name: 'GET /api/message/:message_id',
      path: '/api/message/:message_id',
      method: supertest(app).get
    },
    {
      name: 'PATCH /api/message/:message_id/save',
      path: '/api/message/:message_id/save',
      method: supertest(app).patch
    },
    {
      name: 'PATCH /api/message/:message_id/send',
      path: '/api/message/:message_id/send',
      method: supertest(app).patch
    },
    {
      name: 'PATCH /api/message/:message_id/read',
      path: '/api/message/:message_id/read',
      method: supertest(app).patch
    },
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it('responds 401 "Missing bearer token" when no bearer token', () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: 'Missing bearer token' })
      })

      it('responds 401 "Unauthorized request" when invalid JWT secret', () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: 'Unauthorized request' })
      })

      it('responds 401 "unauthorized request" when invalid sub in payload', () => {
        const invalidUser = { username: 'invalid-user', id: 1 }
        return endpoint.method(endpoint.path)
          .set('authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: 'Unauthorized request' })
      })
    })
  })
})