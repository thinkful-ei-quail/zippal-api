const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('User Endpoints', function() {
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

  describe('POST /api/user', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))
    const requiredFields = ['username', 'password']

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        username: 'test_username',
        password: 'password'
      }

      it(`responds 400 bad request when '${field}' is missing`, () => {
        delete registerAttemptBody[field]

        return supertest(app)
          .post('/api/user')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          })
      })
    })

    it('responds 400 "Password must be longer than 8 characters" when invalid password', () => {
      const userShortPass = {
        username: 'Test_user',
        display_name: 'Testy',
        password: 'pass'
      }

      return supertest(app)
        .post('/api/user')
        .send(userShortPass)
        .expect(400, {
          error: 'Password must be longer than 8 characters'
        })
    })

    it('responds 400 "Password must be less than 72 characters" when invalide password', () => {
      const userLongPass = {
        username: 'Test',
        display_name: 'Testy',
        password: 'a'.repeat(75)
      }

      return supertest(app)
        .post('/api/user')
        .send(userLongPass)
        .expect(400, {
          error: 'Password must be less than 72 characters'
        })
    })

    it('responds 400 "password must not start or end with empty spaces" when password starts with a space', () => {
      const userSpacePass = {
        username: 'Test',
        display_name: 'Test',
        password: ' password1'
      }

      return supertest(app)
        .post('/api/user')
        .send(userSpacePass)
        .expect(400, {
          error: 'Password must not start or end with empty spaces'
        })
    })

    it('responds 400 "password must not start or end with empty spaces" when password ends with a space', () => {
      const userSpacePass = {
        username: 'Test',
        display_name: 'Test',
        password: 'password1 '
      }

      return supertest(app)
        .post('/api/user')
        .send(userSpacePass)
        .expect(400, {
          error: 'Password must not start or end with empty spaces'
        })
    })

    it('responds 400 error when password isn\'t complex enough', () => {
      const userSimplePass = {
        username: 'test',
        display_name: 'testyz',
        password: '11AAaabb'
      }

      return supertest(app)
        .post('/api/user')
        .send(userSimplePass)
        .expect(400, {
          error: 'Password must contain one upper case, lower case, number, and special character'
        })
    })

    it('responds 400 "username already taken" if username isn\'t unique', () => {
      const nonUniqueUser = {
        username: testUser.username,
        display_name: 'Testy',
        password: 'Passw0rd!'
      }

      return supertest(app)
        .post('/api/user')
        .send(nonUniqueUser)
        .expect(400, {
          error: 'Username already taken'
        })
    })

    describe('Given a valid user', () => {
      it('responds 201, serialized user with no password', () => {
        const validUser = {
          username: 'Valid_User',
          display_name: 'Valid',
          password: 'Passw0rd!'
        }

        return supertest(app)
          .post('/api/user')
          .send(validUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(validUser.username)
            expect(res.body.display_name).to.eql(validUser.display_name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)
          })
      })

      it('stores the new user in the db with a bcrypted password', () => {
        const newUser = {
          username: 'Valid_User',
          display_name: 'Valid',
          password: 'Passw0rd!'
        }

        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(res => 
            db
              .from('user')
              .select('*')
              .where({id: res.body.id})
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username)
                expect(row.name).to.eql(newUser.name)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })
  describe('PATCH /api/user', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    it('responds 400, required error when missing request body', () => {
      return supertest(app)
        .patch('/api/user')
        .set('authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(400, {
          error: 'Missing request body'
        })
    })

    const invalidFields = ['username', 'display_name', 'password', 'active_conversations']

    invalidFields.forEach(field => {
      it(`responds 400, invalid error when '${field}' is given`, () => {
        const invalidRequest = {}
        invalidRequest[field] = 'invalid data'

        return supertest(app)
          .patch('/api/user')
          .set('authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(invalidRequest)
          .expect(400, {
            error: `Cannot update '${field}'`
          })
      })
    })

    it('responds 200, updated fields given valid request fields', () => {
      const validRequest = {
        bio: 'I like programming',
        location: 'SLC',
        fa_icon: 'fa-camera'
      }

      return supertest(app)
        .patch('/api/user')
        .set('authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(validRequest)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('location')
          expect(res.body).to.have.property('fa_icon')
        })
        .then(() => {
          db
            .from('user')
            .select('*')
            .whereRaw('id = ?', [testUsers[0].id])
            .first()
            .then(row => {
              expect(row.bio).to.eql('I like programming')
              expect(row.location).to.eql('SLC')
              expect(row.fa_icon).to.eql('fa-camera')
            })
        })
    })
  })
})