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
    {
      id: 1,
      username: 'test_user_1',
      display_name: 'Testy',
      password: 'Passw0rd!'
    },
    {
      id: 2,
      username: 'test_user_2',
      display_name: 'Test_boi',
      password: 'Passw0rd!'
    },
    {
      id: 3,
      username: 'test_user_3',
      display_name: 'Test_gurl',
      password: 'Passw0rd!'
    },
    {
      id: 4,
      username: 'test_user_4',
      display_name: 'Test_bot',
      password: 'Passw0rd!'
    },
  ]
}

function makeConvoArray() {
  return [
    {
      id: 1,
      user_1: 1,
      user_2: 2,
    },
    {
      id: 2,
      user_1: 3,
      user_2: 1,
    },
    {
      id: 3,
      user_1: 4,
      user_2: 2,
    },
    {
      id: 4,
      user_1: 3,
      user_2: 4,
    },
    {
      id: 5,
      user_1: 2,
      user_2: 3,
    },
  ]
}

function makeMessagesArray() {
  return [
    {
      id: 1,
      conversation_id: 1,
      sender_id: 1,
      sender_status: 'Awaiting Reply',
      receiver_id: 2,
      receiver_status: 'Read',
      content: 'Sup',
      is_read: true
    },
    {
      id: 2,
      conversation_id: 1,
      sender_id: 2,
      sender_status: 'Sent',
      receiver_id: 1,
      receiver_status: 'Received',
      content: 'Sup back',
      is_read: false
    },
    {
      id: 3,
      conversation_id: 2,
      sender_id: 1,
      sender_status: 'Sent',
      receiver_id: 3,
      receiver_status: 'Received',
      content: 'Hello',
      is_read: false
    },
    {
      id: 4,
      conversation_id: 3,
      sender_id: 4,
      sender_status: 'Awaiting Reply',
      receiver_id: 2,
      receiver_status: 'Read',
      content: 'This app is cool',
      is_read: true
    },
    {
      id: 5,
      conversation_id: 3,
      sender_id: 2,
      sender_status: 'Pending',
      receiver_id: 4,
      receiver_status: 'Awaiting Message',
      content: 'Work in progress....',
      is_read: false
    },
  ]
}

function makeTestFixtures () {
  const testUsers = makeUsersArray();
  const testConvos = makeConvoArray();
  const testMessages = makeMessagesArray();
  return {testUsers, testConvos, testMessages};
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "user",
        "conversation",
        "message"
        `
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE message_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE conversation_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('message_id_seq', 0)`),
          trx.raw(`SELECT setval('conversation_id_seq', 0)`),
          trx.raw(`SELECT setval('user_id_seq', 0)`),
        ])
      )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('user').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('user_id_seq', ?)`,
      [users[users.length - 1].id]
    )
  })
}


function seedConvos(db, convos) {
  return db.transaction(async (trx) => {   
    try {
      await trx.into('conversation').insert(convos)
      await trx.raw(`SELECT setval('conversation_id_seq', ?)`, [
        convos[convos.length-1].id
      ])
    } catch (error) {
      console.log(error)
    }
    
  })
}

function seedMessages(db, messages) {
  return db.transaction(async trx => {
    try {
      await trx.into('message').insert(messages)
      await trx.raw(`
      SELECT setval('message_id_seq', ?)
      `, [messages[messages.length - 1].id]
      )
    } catch(error) {
      console.log(error)
    }
  })
}

function getExpectedConvos(user_id, convos) {
  return convos.filter((convo) => convo.user_1 === user_id || convo.user_2 === user_id)
}

function getExpectedMessages(user_id, convos, messages) {
  const userConvos = convos.filter((convo) => convo.user_1 === user_id || convo.user_2 === user_id)
  const messageArr = []
  userConvos.forEach(convo => {
    messageArr.push(messages.filter(message => 
      message.conversation_id === convo.id
    ))
  })
  return messageArr
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeConvoArray,
  makeMessagesArray,
  makeTestFixtures,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  seedConvos,
  seedMessages,
  getExpectedConvos,
  getExpectedMessages
}