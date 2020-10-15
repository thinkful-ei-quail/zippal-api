module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
};

// postgres://limgznikfppubn:ba358efc8093b59897d17f3539ee97e356f132fa95355f702ee7d13fdd79f531@ec2-54-160-161-214.compute-1.amazonaws.com:5432/d9nft0vhiqkq73