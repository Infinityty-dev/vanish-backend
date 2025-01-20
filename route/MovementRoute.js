const express = require("express");
const router = express.Router();
const { userMovementPlan, userMovementId ,orderAssessment} = require("../controllers/MovementControl.js");

// POST: Create a new movement and service detail for a user
router.post("/location/:id", userMovementPlan);
router.get("/userId/:id",userMovementId)
router.get("/orderAssessment/:userId",orderAssessment)

module.exports = router;

//GET /api/orders?page=1&limit=5