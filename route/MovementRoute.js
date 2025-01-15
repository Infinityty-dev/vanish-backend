const express = require("express");
const router = express.Router();
const { userMovementPlan } = require("../controllers/MovementControl.js");

// POST: Create a new movement and service detail for a user
router.post("/location/:id", userMovementPlan);

module.exports = router;