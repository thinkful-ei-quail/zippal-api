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
  .get({

  })
  // posting new message to file upon creation of new message
  .post({

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
