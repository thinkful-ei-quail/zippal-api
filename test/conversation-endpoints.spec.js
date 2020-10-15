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

      it('responds with 200 and an empty array', () => {
        return supertest(app)
          .get('/api/conversation')
          .set('authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are conversations in the database', () => {
      beforeEach('insert conversations', async () => {
        await helpers.seedUsers(db, testUsers)
        await helpers.seedConvos(db, testConvos)
      })

      it('GET conversations responds with 200 and all of the conversations', () => {
        
        const expectedConvo = helpers.getExpectedConvos(testUsers[0].id, testConvos);

        return supertest(app)
          .get('/api/conversation')
          .set('authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body.length).to.eql(expectedConvo.length)
            expect(res.body[0]).to.have.property('date_created')
            expect(res.body[0]).to.have.property('is_active')
            expect(res.body[0]).to.have.property('user_1_turn')
            expect(res.body[0]).to.have.property('user_2_turn')
            expect(res.body[0].is_active).to.be.true
          })

      })
    })
  })

  describe('POST /api/conversation', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    it('creates a new conversation, responding with 201 and the new conversation', () => {
      const testUser = testUsers[0];
      const newConversation = helpers.postNewConversation(testUser.id)
      console.log(newConversation)
 

      return supertest(app)
        .post('/api/conversation')
        .set('authorization', helpers.makeAuthHeader(testUser))
        .send(newConversation)
        .expect(201)
    })
  })
})