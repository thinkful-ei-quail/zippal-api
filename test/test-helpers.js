const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL
  })
}

function makeUsersArray() {
  return [
    
  ]
}

module.exports = {
  makeKnexInstance,

}