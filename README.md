# Zip Pal (V 1.0)
### A pen pal app (api)
#### [Hosted Live on Vercel](https://zippal.vercel.app/)

	In the times of Covid 19 and quarantine, we’ve all experienced isolation. Rush University’s research has shown that chronic social isolation increases the risk of mental health issues like depression, anxiety and substance abuse, as well as raises the risk of dementia in older adults. It can also lead to chronic conditions like high blood pressure, heart disease and diabetes.

	Zip pal was created with the idea of promoting conversation to help alleviate social isolation - and hopefully promote productive discourse in our increasingly polarized world. Zip Pal, using our find-a-pal algorithm, connects 2 users together and allows them to talk about shared interests or anything they'd like. 
    
    When registering Users can add their location and a brief bio, this information is useful when other Users are paired with them for a new conversation. When using the find-a-pal feauture, Users can skip to the next Pal or start a new conversation. Users can have up to 5 conversations going at one time and they can leave a conversation at any time.
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
## API Documentation
---

We use this codebase to access our datatables with user, conversation, and message data on the database _server hosted by heroku_.

We also use this codebase to confirm user credentials with the help of _JWT_ for authentication and _bcrypt_ to hash user passwords. 

With the exception of _registration and login_ all endpoints require _JWT_ .

### API Overview

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
--- 

### [/api/auth] Auth Endpoints 

#### [/token] POST 
  * Generating intial token upon successful login

```js
// req.body
{
  username: String,
  password: String
}

// res.body
{
  authToken: String
}
```
#### [/token] PUT 
  * Refreshing token
```js
// req.header
Authorization: Bearer ${token}

// res.body
{
  authToken: ${token}
}
```
---

### [/api/user] User Endpoints 

#### [/] GET 
  * Request User's data

```js
// req.header
Authorization: Bearer ${token}

// res.body
{
  username: String,
  display_name: String,
  active_conversations: String,
  bio: String,
  active_conversations: Number,
  location: String,
  fa_icon: String
}
```

#### [/profile] GET
  * Request User's profile data, serialized with xss (for react-context)

```js
// req.header
Authorization: Bearer ${token}

// res.body
{
  id: String,
  display_name: xss(String),
  username: xss(String),
  location: xss(String),
  bio: xss(String),
  active_conversations: Number,
  fa_icon: String
}
```

#### [/] POST

#### [/] PATCH

---
### [/api/conversation] Conversation Endpoints

#### [/] GET 

#### [/find/:currentConversationIds] GET

#### [/] POST

#### [/:conversation_id/deactivate] PATCH

---

### [/api/message] Message Endpoints

#### [/] POST

#### [/:message_id/save] PATCH

#### [/::message_id/send] PATCH

#### [/::message_id/read] PATCH

---

## Zip Pal is brought to you by 

* [John Bowser](https://github.com/jgbowser)
* [Phillip 'Lip' Cowan](https://github.com/lipcowan)
* [Mathew Murray](https://github.com/MathewMurray)
* [Ryan Whitmore](https://github.com/warptrail)

--- 