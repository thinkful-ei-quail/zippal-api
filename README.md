# Zip Pal 
### A pen pal app (api)
#### [Hosted Live on Vercel](https://zippal.vercel.app/)

Description: [....]
 
---

#### Tech Stack & Dependencies
 ##### Node.js 
  * [Express](http://expressjs.com/)
   * [Cors](https://github.com/expressjs/cors#readme)
  * [Helmet](https://helmetjs.github.io/)
 ##### PostgreSQL 
  * [pg](https://github.com/brianc/node-postgres) 
  * [Knex](https://knexjs.org/)
  * [Postgrator](https://github.com/rickbergfalk/postgrator#readme)
 ##### _Testing_
  * [Chai](http://chaijs.com/)
  * [Mocha](https://mochajs.org/)
  * [Supertest](https://github.com/visionmedia/supertest#readme)
 ##### _Logging_
  * [Morgan](https://github.com/expressjs/morgan#readme)
  * [Winston](https://github.com/winstonjs/winston#readme)
 ##### _Authorization & Authentication_
  * [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js#readme)
  * [JWT](https://github.com/auth0/node-jsonwebtoken#readme)
  * [xss](https://github.com/leizongmin/js-xss) 

---
### API Documentation
---

We use this codebase to access our datatables with user, conversation, and message data on the database _server hosted by heroku_.

We also use this codebase to confirm user credentials with the help of _JWT_ for authentication and _bcrypt_ to hash user passwords. 

With the exception of _registration and login_ all endpoints require _JWT_ .

#### Endpoints

* /api/auth 
* /api/user
* /api/conversation
* /api/message

```text
/api
.
├── /auth/token
│   └── POST
│       └── /
│   └── PUT
│       └── /
├── /users
│   └── GET
│       ├── /
│       └── /profile
│   └── POST
│       └── /
│   └── PATCH
│       └── /
├── /conversation
│   └── GET
│       ├── /
│       └── /find/:currentConversationIds
│   └── POST
│       └── /
│   └── PATCH
│       └── /:conversation_id/deactivate
├── /message
│   └── POST
│       └── /
│   └── PATCH
│       ├── /:message_id/save
│       ├── /:message_id/send
│       └── /:message_id/read
```
