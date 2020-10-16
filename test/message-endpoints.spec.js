const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe.only('Message Endpoints', () => {

  let db

  const { testUsers, testConvos, testMessages }  = helpers.makeTestFixtures()

  before('Make Knex Instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/message', () => {
    beforeEach('seed tables', async () => {
      await helpers.seedUsers(db, testUsers)
      await helpers.seedConvos(db, testConvos)
      await helpers.seedMessages(db, testMessages)
    })

    const requiredFields = ['conversation_id', 'sender_id', 'receiver_id', 'content']

    requiredFields.forEach(field => {
      const newMessage = {
        conversation_id: 1,
        sender_id: 2,
        receiver_id: 1,
        content: 'Test message!!!!!'
      }

      it(`responds 400 required error when '${field}' is missing`, () => {
        delete newMessage[field]

        return supertest(app)
          .post('/api/message')
          .set('authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newMessage)
          .expect(400, {
            error: `Missing '${field}' in request body`
          })
      })
    })
    
  })
})