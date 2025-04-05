const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../middleware/verifytoken');
const axios=require('axios');


const SPRING_BOOT_SIGNUP_URL = process.env.SPRING_BOOT_SIGNUP_URL; 
const SPRING_BOOT_LOGIN_URL = process.env.SPRING_BOOT_LOGIN_URL;
const SPRING_BOOT_PUT_URL = process.env.SPRING_BOOT_PUT_URL;
const SPRING_BOOT_DELETE_URL = process.env.SPRING_BOOT_DELETE_URL;



/**
 * DELETE /api/user
 * Proxies to Spring Boot’s deleteUserById endpoint
 */
router.delete('/', authenticate, async (req, res) => {
  try {
    // Forward the DELETE request with the same Authorization header
    const springRes = await axios.delete(
      `${SPRING_BOOT_DELETE_URL}`,
      { headers: { Authorization: req.headers.authorization } }
    );

    // Spring Boot returns 204 No Content
    return res.status(springRes.status).end();
  } catch (err) {
    if (err.response) {
      // Propagate Spring Boot’s error status & message
      return res
        .status(err.response.status)
        .json(err.response.data || { error: err.response.statusText });
    }
    console.error('Delete proxy error:', err.message);
    return res.status(500).json({ error: 'User delete service unavailable' });
  }
});

router.put('/', authenticate, async (req, res) => {
  try {
    // Forward the update request to Spring Boot
    const springRes = await axios.put(
      `${SPRING_BOOT_PUT_URL}`,
      req.body, 
      { headers: { 
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization 
        } 
      }
    );

    // Spring Boot returns 204 No Content
    return res.status(springRes.status).end();
  } catch (err) {
    if (err.response) {
      // Relay Spring Boot’s error status & message
      return res
        .status(err.response.status)
        .json(err.response.data || { error: err.response.statusText });
    }
    console.error('Update proxy error:', err.message);
    return res.status(500).json({ error: 'User update service unavailable' });
  }
});





module.exports = router;
