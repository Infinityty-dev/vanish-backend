const express = require("express");
const router = express.Router();
const { userMovementPlan, userMovementId } = require("../controllers/MovementControl.js");

// POST: Create a new movement and service detail for a user
router.post("/location/:id", userMovementPlan);
router.get("/userId/:id",userMovementId)

module.exports = router;