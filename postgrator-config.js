require('dotenv').config();

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "host": process.env.MIGRATION_DATABASE_HOST,
  "port": process.env.MIGRATION_DATABASE_PORT,
  // "connectionString": process.env.DATABASE_URL,  - only used for heroku, not local
  "database": process.env.NODE_ENV === 'test' ? process.env.MIGRATION_TEST_DB_NAME : process.env.MIGRATION_DATABASE_NAME,
  "username": process.env.MIGRATION_DATABASE_USERNAME,
  "password": process.env.MIGRATION_DATABASE_PASSWORD
}
