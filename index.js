const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDatabase = require('./database/db.js'); // Import database connection
const userMovementRoutes = require('./route/MovementRoute.js'); // Existing routes
const userAndDriverRoutes = require('./route/UserDriverRoute.js'); // Existing routes
const { paymentGateway } = require('./controllers/paymentGateway.js');
const locationRoutes = require('./route/locationRoutes.js'); // New Location routes

// Initialize Express App
const server = express();
const PORT = process.env.PORT || 5500;

// Connect to Database
connectDatabase();

// Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

// API Routes
server.use('/api/v1/movements', userMovementRoutes);
server.use('/api/v1/users', userAndDriverRoutes);
server.use('/api/v1/payment', paymentGateway )
server.use('/api/v1/locations', locationRoutes); 

// Global Error Handler
server.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: true,
    success: false,
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
