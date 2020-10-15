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
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { user_2 } = req.body
    const newConversation = { user_2 }

       // Validate keys all have values
       for (const [key, value] of Object.entries(newConversation))
       if (value === null) {
         logger.error(`Missing ${key} in request body`);
         return res.status(400).json({
           error: `Missing ${key} in request body`,
         });
       }

       // Set the user_1 to the current user logged in / initiating conversation
      newConversation.user_1 = req.user.id

      // Insert the new conversation  in the database
       ConversationService.beginNewConversation(req.app.get('db'), newConversation)
        .then((conversation) => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${conversation.id}`))
            .json(conversation)
        })
        .catch(next)
  })

  // single conversation
  conversationRouter
  .all(requireAuth)
  .route('/:conversation_id')
  .get((req, res) => {
    res.send('testing')
  })
  

  module.exports = conversationRouter;