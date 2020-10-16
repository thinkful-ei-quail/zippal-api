const app = require('../src/app')
const jwt = require('jsonwebtoken')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Auth Endpoints', function() {
  let db

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/auth/token', () => {
    beforeEach('insert users', () => 
      helpers.seedUsers(
        db,
        testUsers
      )  
    )

    const requiredFields = ['username', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password
      }

      it(`responds 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/token')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          })
      })
    })

    it('responds 400 "invalid username or password" when bad username', () => {
      const invalidUser = {
        username: 'invalid',
        password: 'invalid'
      }
      return supertest(app)
        .post('/api/auth/token')
        .send(invalidUser)
        .expect(400, {
          error: 'Incorrect username or password'
        })
    })

    it('responds 200 and JWT auth token using secret when valid credentials', () => {
      const validUser = {
        username: testUser.username,
        password: testUser.password
      }
      const expectedToken = jwt.sign(
        { id: testUser.id, display_name: testUser.display_name },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256'
        }
      )
      return supertest(app)
        .post('/api/auth/token')
        .send(validUser)
        .expect(200, {
          authToken: expectedToken
        })
    })
  })

  describe('PATCH /api/auth/token', () => {
    beforeEach('insert users', () => 
      helpers.seedUsers(
        db,
        testUsers
      )
    )

    it('responds 200 and JWT auth token using secret', () => {
      const expectedToken = jwt.sign(
        { id: testUser.id, display_name: testUser.display_name },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256'
        }
      )
      return supertest(app)
        .put('/api/auth/token')
        .set('authorization', helpers.makeAuthHeader(testUser))
        .expect(200, {
          authToken: expectedToken
        })
    })
  })
})