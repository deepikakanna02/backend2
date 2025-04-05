// node-backend/config/jwtconfig.js

require('dotenv').config(); // ensures process.env.JWT_SECRET is loaded

/**
 * Export the JWT secret for signing/verifying tokens.
 * This must match the 'jwt.secret' in your Spring Boot application.properties.
 */
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('❌ JWT_SECRET not defined in .env');
  process.exit(1);
}

module.exports = jwtSecret;
