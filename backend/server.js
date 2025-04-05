// node-backend/server.js

const cors        = require('cors');
// const rateLimit   = require('express-rate-limit');
const dotenv      = require('dotenv');
const app         = require('./app');

// Load env variables
dotenv.config();

// Enable CORS
app.use(cors());

// Rate limiter (optional)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100                  // limit each IP to 100 requests per window
// });
// app.use(limiter);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Node.js backend running on port ${PORT}`);
});
