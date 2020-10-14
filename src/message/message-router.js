const express = require('express');
const path = require('path');
const MessageService = require('./message-service');
const { requireAuth } = require('../middleware/jwt-auth');

const messageRouter = express.Router();
const jsonBodyParser = express.json();

messageRouter
  .route('/')

  // all methods will require being logged-in - will need to use requireAuth
  .all(requireAuth)
  
  // get all messages in conversation
  .get((req, res, next) => {
      MessageService.getAllMessages(
          req.app.get('db'),
          req.params.conversation_id
      )
        .then(messages => {
            res.json(MessageService.serializeMessages(messages))
        })
        .catch(next)
  })
  
  // posting new message to file upon creation of new message
  .post(jsonBodyParser, (req, res, next) => {
      const {
          conversation_id, 
          sender_id, 
          sender_status,
          receiver_id,
          receiver_status,
          content
      } = req.body

      const newMessage = {
          conversation_id,
          sender_id,
          sender_status,
          receiver_id,
          receiver_status,
          content
      }

      for(const [key, value] of Object.entries(newMessage))
        if(value == null)
          return res.status(400).json({
              error: `Missing '${key}' in request body`
          })

      MessageService.insertMessage(
          req.app.get('db'),
          newMessage
      )
        .then(message => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${message.id}`))
              .json(MessageService.serializeMessage(message))
        })
        .catch(next)
  })
    
messageRouter
  .route('/:message_id')
  .all(requireAuth)

  // get specific message
  .get({

  })

messageRouter
  .route('/:message_id/save')
  .all(requireAuth)
  // patching message with most recent save and updating content 
  .patch({

  })

messageRouter
  .route('/:message_id/send')
  .all(requireAuth)
  // - or sending file and changing the content and status 
  .patch({

  })

messageRouter
  .route('/:message_id/read')
  .all(requireAuth)
  // patch again and update status - return message for recipient to read.