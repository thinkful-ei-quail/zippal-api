require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const userRouter = require('./user/user-router')
const conversationRouter = require('./conversation/conversation-router')
const errorHandler = require('./middleware/error-handler')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(helmet())
app.use(cors())

app.use('/api/user', userRouter )
app.use('/api/auth', authRouter)
app.use('/api/conversation', conversationRouter)

app.use(errorHandler)


module.exports = app