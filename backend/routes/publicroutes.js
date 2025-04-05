const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../middleware/verifytoken');
const axios=require('axios');

const SPRING_BOOT_SIGNUP_URL = process.env.SPRING_BOOT_SIGNUP_URL; 
const SPRING_BOOT_LOGIN_URL = process.env.SPRING_BOOT_LOGIN_URL;
const SPRING_BOOT_PUT_URL = process.env.SPRING_BOOT_PUT_URL;
const SPRING_BOOT_DELETE_URL = process.env.SPRING_BOOT_DELETE_URL;

// e.g. http://localhost:8080/finTech/public

// Public registration endpoint: proxy to Spring Boot
router.post('/register', async (req, res) => {
  try {
    // Forward the entire body to Spring Boot’s signup API
    const springRes = await axios.post(
      `${SPRING_BOOT_SIGNUP_URL}`,
      req.body,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // If Spring Boot returns 201, relay that back
    return res
      .status(springRes.status)
      .json(springRes.data || { message: 'User registered via Spring Boot' });

  } catch (err) {
    // If Spring Boot responded with an error, propagate it
    if (err.response) {
      return res
        .status(err.response.status)
        .json(err.response.data || { error: err.response.statusText });
    }
    // Otherwise, it was a network or unexpected error
    console.error('Error proxying to Spring Boot:', err.message);
    return res.status(500).json({ error: 'Registration service unavailable' });
  }
});

router.post('/login', async (req, res) => {
  try {
    // Forward credentials to Spring Boot
    const springRes = await axios.post(
      `${SPRING_BOOT_LOGIN_URL}`,
      req.body,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // On success, Spring Boot returns the JWT string in the body
    const token = springRes.data;
    // Relay status and token
    return res.status(springRes.status).json({ token });

  } catch (err) {
    if (err.response) {
      // Spring Boot returned an error (e.g. 400 for bad credentials)
      return res
        .status(err.response.status)
        .json(err.response.data || { error: err.response.statusText });
    }
    console.error('Login proxy error:', err.message);
    return res.status(500).json({ error: 'Authentication service unavailable' });
  }
});











module.exports = router;
