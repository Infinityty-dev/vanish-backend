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
      typeOfVehicle,
    } = req.body;

    const userId = req.params.id;

    // Input validation
    if (
      !serviceType ||
      !pickUpDate ||
      !pickUpLocation ||
      !pickUpZone ||
      !dropOffLocation ||
      !dropOffZone ||
      !typeOfVehicle
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
          typeOfVehicle,
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

//**************************************************************************************************************** */

const userMovementId = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID not provided.",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "User ID found successfully.",
      data: userId,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error occurred.",
      error: true,
      success: false,
    });
  }
};



//*************************************************************************************************************** */

// const orderAssessment = async(req,res) =>{
  
//   //fetching existing data
//     try {
//       const orderInfo = await MovementModel.find().select('serviceType pickUpDate pickUpLocation pickUpZone dropOffLocation dropOffZone  runningService: user._id,');
  
//       res.status(200).json({
//         message: 'User data fetched successfully',
//         data: orderInfo,
//         success: true,
//       });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch user data' });
//     }
//   };

// const orderAssessment = async (req, res) => {
//   try {
//     // Apply filters, pagination, and field selection
//     const {userId, page = 1, limit = 2 } = req.query; // Default pagination values

//     const orderInfo = await MovementModel.findOne({userId})
//       .select('serviceType pickUpDate pickUpLocation pickUpZone dropOffLocation dropOffZone typeOfVehicle') // Select only required fields
//       .skip((page - 1) * limit) // Skip documents for pagination
//       .limit(Number(limit)); // Limit the number of documents per page

//     // If no data is found
//     if (!orderInfo.length) {
//       return res.status(404).json({
//         message: 'No orders found',
//         data: [],
//         success: false,
//       });
//     }

//     res.status(200).json({
//       message: 'Order data fetched successfully',
//       data: orderInfo,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error); // Log detailed error for debugging
//     res.status(500).json({
//       message: 'Failed to fetch order data',
//       error: error.message,
//       success: false,
//     });
//   }
// };

//GET /api/orders?page=1&limit=5

// const orderAssessment = async (req, res) => {
//   try {
//     // Extract filters and pagination values from the query
//     const { userId, page = 1, limit = 10, sort = 'pickUpDate', order = 'asc' } = req.query;

//     // Validate pagination values
//     const pageNumber = Math.max(1, parseInt(page));
//     const limitNumber = Math.max(1, parseInt(limit));

//     // Build the filter query
//     const filters = {};
//     if (userId) filters.runningService = userId; // Filter by userId if provided

//     // Fetch data with filters, pagination, and sorting
//     const orderInfo = await MovementModel.find(filters)
//       .select('serviceType pickUpDate pickUpLocation pickUpZone dropOffLocation dropOffZone') // Select only necessary fields
//       .sort({ [sort]: order === 'desc' ? -1 : 1 }) // Sort dynamically based on query
//       .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
//       .limit(limitNumber); // Limit documents per page

//     // If no data is found
//     if (!orderInfo.length) {
//       return res.status(404).json({
//         message: 'No orders found for the given criteria',
//         data: [],
//         success: false,
//       });
//     }

//     // Count total records for pagination metadata
//     const totalOrders = await MovementModel.countDocuments(filters);

//     res.status(200).json({
//       message: 'Order data fetched successfully',
//       data: orderInfo,
//       pagination: {
//         totalOrders,
//         currentPage: pageNumber,
//         totalPages: Math.ceil(totalOrders / limitNumber),
//       },
//       success: true,
//     });
//   } catch (error) {
//     console.error('Error fetching order data:', error.message); // Log error for debugging
//     res.status(500).json({
//       message: 'Failed to fetch order data',
//       error: error.message,
//       success: false,
//     });
//   }
// };

//*************************************************************************** */


const orderAssessment = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from route parameters

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required.",
        success: false,
      });
    }

    // Find the latest order for the given userId
    const orderInfo = await MovementModel.findOne({ runningService: userId })
      .select('serviceType pickUpDate pickUpLocation pickUpZone dropOffLocation dropOffZone typeOfVehicle') // Select necessary fields
      .sort({ createdAt: -1 }); // Sort by creation date (latest order first)

    // If no orders are found
    if (!orderInfo) {
      return res.status(404).json({
        message: "No current order found for this user.",
        success: false,
        data: null,
      });
    }

    // Respond with the order information
    res.status(200).json({
      message: "Current order data fetched successfully.",
      success: true,
      data: orderInfo,
    });
  } catch (error) {
    // Handle server errors
    console.error("Error fetching current order:", error.message);
    res.status(500).json({
      message: "Failed to fetch current order data.",
      success: false,
      error: error.message,
    });
  }
};



module.exports = { userMovementPlan,userMovementId, orderAssessment };
