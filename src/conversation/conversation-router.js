const express = require('express')
const path = require('path')
const ConversationService = require('./conversation-service.js')
const { requireAuth } = require('../middleware/jwt-auth')




const conversationRouter = express.Router()
const jsonBodyParser = express.json()

conversationRouter
  .route('/')
  .all(requireAuth)
  .get(async (req, res, next) => {
    try {
      const conversations = await ConversationService.getUsersConversations(
        req.app.get('db'),
        req.user.id
      )

      const messages = await Promise.all(conversations.map(convo => 
        ConversationService.getConversationMessages(
          req.app.get('db'),
          convo.id
        ))
      )  
      
      res.json({ conversations, messages })
      next()

    } catch(error) {
      next(error)
    }
  });

// single conversation
conversationRouter
  .all(requireAuth)
  .route('/:conversation_id')
  .get(async (req, res, next) => {
    try {

      res.send('testing')
      next()

    } catch(error) {
      next(error)
    }
  })
  

module.exports = conversationRouter;