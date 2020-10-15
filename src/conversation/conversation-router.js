const express = require('express')
const path = require('path')
const ConversationService = require('./conversation-service.js')
const { requireAuth } = require('../middleware/jwt-auth')




const conversationRouter = express.Router()
const jsonBodyParser = express.json()

// Get all conversations
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
  })  // Post - start a new conversation between two users
  .post(jsonBodyParser, async (req, res, next) => {
    try {
      const {user_2} = req.body;
      const newConversation = {user_1: req.user.id, user_2}
      const conversation = await ConversationService.beginNewConversation(req.app.get('db'), newConversation);
    
      res.status(201).json(conversation)
      
    } catch (error) {
      next(error)
    }
  })

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
