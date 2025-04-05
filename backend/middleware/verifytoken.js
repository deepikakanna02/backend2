// node-backend/middleware/authenticate.js

const jwt = require('jsonwebtoken');
const axios = require('axios');
const jwtSecret = require('../config/jwtconfig');  // matches our earlier config
require('dotenv').config();

/**
 * 1) Try to verify the token locally with the shared secret.
 * 2) If verification fails (expired or bad signature), call your Spring Boot auth service
 *    (you’ll need a dedicated verify endpoint, e.g. /public/verify or reuse /public/health-check).
 * 3) If Spring Boot says “OK,” decode the token locally (to get user info) and proceed.
 * 4) Otherwise, reject with 401.
 */
module.exports = async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied: no token provided' });
  }

  const token = header.split(' ')[1];

  // 1) Local verification
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;            // attach payload (sub, roles, etc.)
    return next();
  } catch (localErr) {
    // Only fallback on token expiration or signature error
    // (you might inspect localErr.name if you want more control)
  }

  // 2) Fallback to Spring Boot verify endpoint
  try {
    // Make sure SPRING_BOOT_VERIFY_URL is set, e.g. http://localhost:8080/finTech/public/health-check
    const verifyUrl = process.env.SPRING_BOOT_VERIFY_URL;
    if (!verifyUrl) {
      throw new Error('SPRING_BOOT_VERIFY_URL not configured');
    }

    const response = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      // 3) Spring Boot says OK → decode locally to get payload
      const decoded = jwt.decode(token, { complete: false });
      req.user = decoded;
      return next();
    } else {
      return res.status(401).json({ message: 'Invalid token (Spring Boot rejected)' });
    }
  } catch (bootErr) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
