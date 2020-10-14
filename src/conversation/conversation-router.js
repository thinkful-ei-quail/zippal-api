const express = require('express')
const path = require('path')
const ConversationService = require('./conversation-service.js')
const { requireAuth } = require('../middleware/jwt-auth')



const conversationRouter = express.Router()
const jsonBodyParser = express.json()

conversationRouter
  .route('/')
  .all(requireAuth)
  .get((req, res) => {
    ConversationService.getUsersConversations(
      req.app.get('db'),
      req.user.id
    )
    .then((conversations) => {
      console.log(req.user.id)
    })
  })

  module.exports = conversationRouter;