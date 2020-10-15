const express = require('express')
const path = require('path')
const ConversationService = require('./conversation-service.js')
const { requireAuth } = require('../middleware/jwt-auth')
const testHelpers = require('../../test/test-helpers.js')
const { request } = require('http')



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
    
      // if no users are available for conversation then return 404

      res.status(201).json(conversation)
      
    } catch (error) {
      next(error)
    }
  })

  // find a random person available
  // then start new conversation (or not)
  conversationRouter
    .route('/find')
    .all(requireAuth)
    // get available users
    .get(jsonBodyParser, async (req, res, next) => {
      const { currentConversationIds } = req.body // array of ids
      console.log(req.body)
      try {
        const availableUsers = await ConversationService.getAvailableUsers(req.app.get('db'))
        const filteredUsers = availableUsers.filter((u) => {
         return (currentConversationIds.includes(u.id) || u.id === req.user.id) ? null : u
        })

        const randomUser = filteredUsers[Math.floor(Math.random() * filteredUsers.length)]

        res.status(200).json(randomUser)

      } catch (error) {
        next(error)
      }
    })

    // accept conversation and then do post
    // or look for another person to pair with


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
