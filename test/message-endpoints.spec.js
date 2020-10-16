const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Message Endpoints', () => {

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
    it('responds 201, serialized message when new message successfully created', () => {
      const conversation = testConvos[1] //user 1 & user 3
      const validMessage = {
        conversation_id: conversation.id,
        sender_id: testUsers[0].id,
        receiver_id: testUsers[2].id,
        content: ''
      }

      return supertest(app)
        .post('/api/message')
        .set('authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(validMessage)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.eql(6)
          expect(res.body).to.have.property('sender_status')
          expect(res.body.sender_status).to.eql('Pending')
          expect(res.body).to.have.property('receiver_status')
          expect(res.body.receiver_status).to.eql('Awaiting Message')
          expect(res.body.content).to.eql('Message in progress...')
          expect(res.body).to.have.property('date_sent')
          expect(res.body.date_sent).to.eql(null)
          expect(res.body).to.have.property('is_read')
          expect(res.body.is_read).to.be.false
        })
    })
  })

  describe('PATCH /:message_id/save', () => {
    beforeEach('seed tables', async () => {
      await helpers.seedUsers(db, testUsers)
      await helpers.seedConvos(db, testConvos)
      await helpers.seedMessages(db, testMessages)
    })

    it('responds 404 "Message doesn\'t exist" when given invalid message id', () => {
      return supertest(app)
        .patch('/api/message/100/save')
        .set('authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(404, {
          error: `Message doesn't exist`
        })
    })

    it('responds 400, required error when no content in request body', () => {
      const noContentMessage = {
        ...testMessages[4],
        content: ''
      }

      return supertest(app)
        .patch(`/api/message/${testMessages[4].id}/save`)
        .set('authorization', helpers.makeAuthHeader(testUsers[1]))
        .expect(400, {
          error: 'Request body must contain content'
        })
    })
    it('responds 200, serialized message when given valid request', () => {
      const validMessage = {
        ...testMessages[4],
        content: 'This is a draft of a message'
      }

      return supertest(app)
        .patch(`/api/message/${testMessages[4].id}/save`)
        .set('authorization', helpers.makeAuthHeader(testUsers[1]))
        .send(validMessage)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.eql(5)
          expect(res.body).to.have.property('sender_status')
          expect(res.body.sender_status).to.eql('Pending')
          expect(res.body).to.have.property('receiver_status')
          expect(res.body.receiver_status).to.eql('Awaiting Message')
          expect(res.body.content).to.eql(validMessage.content)
          expect(res.body).to.have.property('date_sent')
          expect(res.body.date_sent).to.eql(null)
          expect(res.body).to.have.property('is_read')
          expect(res.body.is_read).to.be.false
        })
    })
  })

  describe('PATCH /api/message/:message_id/send', () => {
    beforeEach('seed tables', async () => {
      await helpers.seedUsers(db, testUsers)
      await helpers.seedConvos(db, testConvos)
      await helpers.seedMessages(db, testMessages)
    })

    it('responds 404 "Message doesn\'t exist" when given invalid message id', () => {
      return supertest(app)
        .patch('/api/message/100/save')
        .set('authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(404, {
          error: `Message doesn't exist`
        })
    })

    const requiredFields = [
      'content',
      'sender_status',
      'receiver_status',
      'date_sent'
    ]

    requiredFields.forEach(field => {
      const newMessage = {
        content: 'Finally sending this message',
        sender_status: 'Sent',
        receiver_status: 'Received',
        date_sent: new Date()
      }

      it(`responds 400, required error when '${field}' is missing in request body`, () => {
        delete newMessage[field]

        return supertest(app)
          .patch(`/api/message/${testMessages[4].id}/send`)
          .set('authorization', helpers.makeAuthHeader(testUsers[1]))
          .send(newMessage)
          .expect(400, {
            error: `Missing '${field}' in request body`
          })
      })
    })
    it('responds 200, serialized message, and sets conversation turns when successful request made', function() {
      this.retries(3)
      const newMessage = {
        content: 'Finally sending this message',
        sender_status: 'Sent',
        receiver_status: 'Received',
        date_sent: new Date()
      }

      return supertest(app)
        .patch(`/api/message/${testMessages[4].id}/send`)
        .set('authorization', helpers.makeAuthHeader(testUsers[1]))
        .send(newMessage)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.eql(5)
          expect(res.body).to.have.property('conversation_id')
          expect(res.body.conversation_id).to.eql(3)
          expect(res.body).to.have.property('sender_status')
          expect(res.body.sender_status).to.eql('Sent')
          expect(res.body).to.have.property('receiver_status')
          expect(res.body.receiver_status).to.eql('Received')
          expect(res.body.content).to.eql(newMessage.content)
          expect(res.body).to.have.property('date_sent')
          const expectedDate = new Date().toLocaleString()
          const actualDate = new Date(res.body.date_sent).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
          expect(res.body).to.have.property('is_read')
          expect(res.body.is_read).to.be.false
        })
        .expect(res => {
          db
            .from('conversation')
            .where('id', res.body.conversation_id)
            .first()
            .then(row => {
              expect(row.user_1_turn).to.be.true
              expect(row.user_2_turn).to.be.false
            })
        })

    })
  })

  describe('PATCH /api/message/:message_id/read', () => {
    beforeEach('seed tables', async () => {
      await helpers.seedUsers(db, testUsers)
      await helpers.seedConvos(db, testConvos)
      await helpers.seedMessages(db, testMessages)
    })

    const requiredFields = [
      'sender_status',
      'receiver_status',
      'is_read'
    ]

    requiredFields.forEach(field => {
      const updatedMessageFields = {
        sender_status: 'Awaiting Reply',
        receiver_status: 'Read',
        is_read: true
      }

      it(`responds 400, required error when '${field}' is missing in body`, () => {
        delete updatedMessageFields[field]

        return supertest(app)
          .patch(`/api/message/${testMessages[2].id}/read`)
          .set('authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(updatedMessageFields)
          .expect(400, {
            error: `Missing '${field}' in request body`
          })
      })
    })

    it('responds 200, serialized message when valid request sent', () => {
      const updatedMessageFields = {
        sender_status: 'Awaiting Reply',
        receiver_status: 'Read',
        is_read: true
      }

      return supertest(app)
        .patch(`/api/message/${testMessages[2].id}/read`)
        .set('authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(updatedMessageFields)
        .expect(200)
        .expect(res => {
          expect(res.body.sender_status).to.eql(updatedMessageFields.sender_status)
          expect(res.body.receiver_status).to.eql(updatedMessageFields.receiver_status)
          expect(res.body.is_read).to.be.true
        })
    })
  })
})