const express = require('express')
const path = require('path')
const ConversationService = require('./conversation-service.js')
const { requireAuth } = require('../middleware/jwt-auth')



const userRouter = express.Router()
const jsonBodyParser = express.json()

conversationRouter
 .use(requireAuth)
 .use(async (req, res, next) => {
   try {
      const conversations = await ConversationService.getUsersConversations(
        req.app.get('db'),
        req.user.id
      )
      
      if (!conversations) {
        return res.status(404).json({
          error: `You don't have any conversations`
        })
      }

      next()
   } catch (error) {
     next(error)
   }
 })