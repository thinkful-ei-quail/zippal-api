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

    before('cleanup', () => helpers.cleanTables())

    afterEach('cleanup', () => helpers.cleanTables())

    describe('GET /api/message', () => {
        context('Given there is no data', () => {
            beforeEach('seed users', () => helpers.seedUsers())
        })
    })

})