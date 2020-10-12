# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`
7. set up express, morgan, cors, and helmet in the `app.js`
8. create a `logger.js` file in src for winston and set up
9. create a `postgrator-config.js` file in root directory to set up postgrator
10. edit the `config.js` file to manage env variables
11. check below for dependency explanations and links to docs


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

build tables in database using migration scripts `npm run migrate [#]`

build tables in test database for testing purposes `npm run migrate:test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

## Dependencies and Docs

1. cors - middleware for enabling cross origin resource sharing [cors docs](https://www.npmjs.com/package/cors)
2. dotenv - loads variables from .env files to process.env [dotenv docs](https://www.npmjs.com/package/dotenv)
3. express - Node.js API web framework [express docs](https://expressjs.com/)
4. helmet - secure express apps by setting/hiding http headers [helmet docs](https://helmetjs.github.io/)
5. knex - SQL query builder for postgreSQL and various other SQL databases [knex docs](https://helmetjs.github.io/)
6. morgan - http request logger middleware [morgan docs](https://www.npmjs.com/package/morgan)
7. pg - postgres drivers needed for winston and knex [pg docs](https://www.npmjs.com/package/pg)
8. winston - creates a log file of http requests [winston docs](https://www.npmjs.com/package/winston)
9. xss - filters cross site scripting from user input [xss docs](https://www.npmjs.com/package/xss)
10. chai - test assertion library, pairs with mocha [chai docs](https://www.chaijs.com/)
11. mocha - test framework [mocha docs](https://mochajs.org/)
12. nodemon - monitors for code changes and refreshes server [nodemon docs](https://nodemon.io/)
13. postgrator(-cli) - command line SQL database migration tool [postgrator docs](https://www.npmjs.com/package/postgrator-cli?activeTab=readme)
14. supertest - http assertion tool to be used with mocha/chai [supertest docs](https://www.npmjs.com/package/supertest)