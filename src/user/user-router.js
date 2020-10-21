const express = require('express')
const path = require('path')
const UserService = require('./user-service.js')
const { requireAuth } = require('../middleware/jwt-auth')

const userRouter = express.Router()
const jsonBodyParser = express.json()

userRouter
  .route('/')
  .post(jsonBodyParser, async (req, res, next) => {
    const { password, username, display_name } = req.body

    for(const field of ['username', 'password']) {
      if(!req.body[field]) {
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      }
    }

    try {
      const passwordError = UserService.validatePassword(password)

      if(passwordError) {
        return res.status(400).json({ error: passwordError })
      }

      const hasUserWithUserName = await UserService.hasUserWithUserName(
        req.app.get('db'),
        username
      )

      if(hasUserWithUserName) {
        return res.status(400).json({ error: 'Username already taken' })
      }
      
      const hashedPassword = await UserService.hashPassword(password)

      const newUser = {
        username,
        password: hashedPassword,
        display_name
      }

      const user = await UserService.insertUser(
        req.app.get('db'),
        newUser
      )

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(UserService.serializeUser(user))
    } catch(error) {
      next(error)
    }
  })
  .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
    console.log('@@@@@', req.body)
    
    // for(const field of ['username', 'password', 'display_name', 'active_conversations']) {
    //   if(req.body[field]) {
    //     return res.status(400).json({
    //       error: `Cannot update '${field}'`
    //     })
    //   }
    // }

   

    if(!req.body.bio && !req.body.location && !req.body.fa_icon) {
      return res.status(400).json({
        error: 'Missing request body'
      })
    }

    const [ userFields ] = await UserService.updateUser(
      req.app.get('db'),
      req.user.id,
      req.body
    )

    res.status(200).json(userFields)
  })

module.exports = userRouter