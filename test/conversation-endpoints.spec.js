const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Conversation Endpoints', function () {
  let db

  const {testUsers, testConvos, testMessages } = helpers.makeTestFixtures();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db);
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => helpers.cleanTables(db))
  afterEach('clean the table', () => helpers.cleanTables(db))

  describe(`GET /api/conversation`, () => {

    context('Given there is no data', () => {
      beforeEach('seed users', () => {
        helpers.seedUsers(db, testUsers)
      })

      it('responds with 200 and empty arrays', () => {
        return supertest(app)
          .get('/api/conversation')
          .set('authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, { conversations: [], messages: [] })
      })
    })

    context('Given there are conversations in the database', () => {
      beforeEach('insert conversations', async () => {
        await helpers.seedUsers(db, testUsers)
        await helpers.seedConvos(db, testConvos)
        await helpers.seedMessages(db, testMessages)
      })

      it('responds with 200 and all of the conversations', () => {
        
        const expectedConvo = helpers.getExpectedConvos(testUsers[0].id, testConvos);

        return supertest(app)
          .get('/api/conversation')
          .set('authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body.conversations.length).to.eql(expectedConvo.length)
            expect(res.body.conversations[0]).to.have.property('date_created')
            expect(res.body.conversations[0]).to.have.property('is_active')
            expect(res.body.conversations[0]).to.have.property('user_1_turn')
            expect(res.body.conversations[0]).to.have.property('user_2_turn')
            expect(res.body.conversations[0].is_active).to.be.true
          })

      })
      it('responds with all messages related to active conversations', () => {
        const expectedMessages = helpers.getExpectedMessages(
          testUsers[0].id,
          testConvos,
          testMessages
        )
        
        return supertest(app)
          .get('/api/conversation')
          .set('authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect(res => {
            expect(res.body).to.have.property('conversations')
            expect(res.body).to.have.property('messages')
            expect(res.body.messages.length).to.eql(expectedMessages.length)
          })
      })
    })
  })
})