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
      res.json(conversations)
    })
  });

  // single conversation
  conversationRouter
  .all(requireAuth)
  .route('/:conversation_id')
  .get((req, res) => {
    res.send('testing')
  })
  

  module.exports = conversationRouter;