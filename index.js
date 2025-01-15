const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDatabase = require('./database/db.js');
const userMovementRoutes = require('./route/MovementRoute.js');
const userAndDriverRoutes = require('./route/UserDriverRoute.js');

// Initialize Express App
const server = express();
const PORT = process.env.PORT || 5500;


// Connect to Database
connectDatabase();

// Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

// // API Routes
server.use('/api/v1/movements', userMovementRoutes);
server.use('/api/v1/users', userAndDriverRoutes);

// Global Error Handler
server.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: true,
    success: false,
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
