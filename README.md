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

We use this codebase to access our datatables (user, conversation, message) in our database _server hosted on heroku_ with user information and their conversations.

We also use this codebase to confirm user credentials with the help of JWT for authentication and bcrypt to hash user passwords. 

With the exception of our _registration and login_ our endpoints require JWT.

#### Endpoints

* /api/auth 
* /api/user
* /api/conversation
* /api/message