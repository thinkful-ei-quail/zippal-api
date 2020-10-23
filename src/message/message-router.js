const express = require("express");
const path = require("path");
const MessageService = require("./message-service");
const { requireAuth } = require("../middleware/jwt-auth");

const messageRouter = express.Router();
const jsonBodyParser = express.json();

messageRouter
  .route("/")
  // all methods will require being logged-in - will need to use requireAuth
  .all(requireAuth)
  // posting new message to file upon creation of new message
  .post(jsonBodyParser, (req, res, next) => {
    const {
      id,
      user_2,
    } = req.body;

    const newMessage = {
      conversation_id: id,
      sender_id: req.user.id,
      // sender_status, - will use table default
      receiver_id: user_2,
      // receiver_status, - will use table default
      content: 'Message in Progress...',
    };

    for (const [key, value] of Object.entries(newMessage))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    MessageService.insertMessage(req.app.get("db"), newMessage)
      .then((message) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${message.id}`))
          .json(MessageService.serializeMessage(message));
      })
      .catch(next);
  });

// THIS ROUTE IS LIKELY REDUNDANT. COMMENTED OUT FOR NOW //
// messageRouter
//   .route("/:message_id")
//   .all(requireAuth)
//   .all(checkMessageExists)

//   // open specific message - need specific id ... from params, use getbyID
//   .get((req, res) => {
//     MessageService.getByID(
//       req.app.get('db'),
//       req.params.message_id
//     )
//       .then(message => 
//         res
//           .status(200)
//           .json(MessageService.serializeMessage(message))
//       )
      
//   });

messageRouter
  .route("/:message_id/save")
  .all(requireAuth)
  .all(checkMessageExists)
  // patching message with most recent save and updating content
  .patch(jsonBodyParser, (req, res, next) => {
    const {content} = req.body
    const updatedMessageField = {content}

    const numberOfValues = Object.values(updatedMessageField).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: `Request body must contain content`
      })

    MessageService.updateMessage(
      req.app.get('db'),
      req.params.message_id,
      updatedMessageField
    )
      .then(message => {
        res
          .status(200)
          .json(MessageService.serializeMessage(message))
      })
      .catch(next)
  });

messageRouter
  .route("/:message_id/send")
  .all(requireAuth)
  .all(checkMessageExists)
  // - or sending file and changing the content and status
  .patch(jsonBodyParser, (req, res, next) => {
    const {content, sender_status, receiver_status, date_sent} = req.body
    const updatedMessageFields = {content, sender_status, receiver_status, date_sent}
    // sender_status --> 'Sent' || receiver_status --> 'Received' 
    for(const [key, value] of Object.entries(updatedMessageFields))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    MessageService.updateMessage(
      req.app.get('db'),
      req.params.message_id,
      updatedMessageFields
    )
      .then(async message => {
        await MessageService.setConversationTurns(
          req.app.get('db'),
          message.conversation_id
        )
        return message
      })
      .then(message => {
        res
          .status(200)
          .json(MessageService.serializeMessage(message)) 
      })
      .catch(next)
  });

messageRouter
  .route("/:message_id/read")
  .all(requireAuth)
  .all(checkMessageExists)
  // patch again and update status - return message for recipient to read.
  .patch(jsonBodyParser, (req, res, next) => {
    const {sender_status, receiver_status, is_read} = req.body
    const updatedMessageFields = {sender_status, receiver_status, is_read}
    // sender_status --> 'Awaiting Reply' || receiver_status --> 'Read' || is_read --> TRUE

    for(const [key, value] of Object.entries(updatedMessageFields))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    MessageService.updateMessage(
      req.app.get('db'),
      req.params.message_id, 
      updatedMessageFields
    )
      .then(message => {
        res
          .status(200)
          .json(MessageService.serializeMessage(message))
      })
      .catch(next)
  });

async function checkMessageExists(req, res, next) {
  try {
    const message = await MessageService.getByID(
      req.app.get("db"),
      req.params.message_id
    );
    if (!message)
      return res.status(404).json({
        error: `Message doesn't exist`,
      });
    res.message = message;
    next();
  } catch (error) {
    next(error)
  }
}

module.exports = messageRouter;
