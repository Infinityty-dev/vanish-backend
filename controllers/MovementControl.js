const UserModel = require("../models/UserModel.js");
const MovementModel = require("../models/MovementModel.js");
const mongoose = require("mongoose");

/**
 * Create a user's movement plan
 */
const userMovementPlan = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      serviceType,
      pickUpDate,
      pickUpLocation,
      pickUpZone,
      dropOffLocation,
      dropOffZone,
    } = req.body;

    const userId = req.params.id;

    // Input validation
    if (
      !serviceType ||
      !pickUpDate ||
      !pickUpLocation ||
      !pickUpZone ||
      !dropOffLocation ||
      !dropOffZone
    ) {
      return res.status(400).json({
        message: "All input fields are required.",
        error: true,
        success: false,
      });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
        error: true,
        success: false,
      });
    }

    // Start transaction
    session.startTransaction();

    // Find user
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    // Create movement service
    const newMovement = await MovementModel.create(
      [
        {
          serviceType,
          pickUpDate,
          pickUpLocation,
          pickUpZone,
          dropOffLocation,
          dropOffZone,
          runningService: user._id,
        },
      ],
      { session }
    );

    // Initialize userAccount if it doesn't exist
    user.userAccount = user.userAccount || [];
    user.userAccount.push(newMovement[0]._id);

    // Save user with updated movement
    await user.save({ session });

    // Commit transaction
    await session.commitTransaction();

    return res.status(201).json({
      message: "Movement detail created successfully.",
      data: newMovement[0],
      success: true,
    });
  } catch (error) {
    // Rollback transaction if any error occurs
    await session.abortTransaction();

    console.error("Error creating movement plan:", error);
    return res.status(500).json({
      message: error.message || "Failed to create movement plan.",
      error: true,
      success: false,
    });
  } finally {
    session.endSession();
  }
};

module.exports = { userMovementPlan };
