const mongoose = require('mongoose');

// Define the Service Schema
const serviceSchema = new mongoose.Schema(
  {
    runningService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Improves query performance on user-based lookups
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
      enum: ["OFFICE", "HOME", "WAREHOUSE"], // Example service types
    },
    pickUpDate: {
      type: Date,
      required: true,
      index: true, // Useful for scheduling queries
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Pick-up date cannot be in the past.",
      },
    },
    pickUpLocation: {
      type: String,
      required: true,
      trim: true,
    },
    pickUpZone: {
      type: String,
      required: true,
      trim: true,
    },
    dropOffLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dropOffZone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Add compound index for service scheduling optimization
// serviceSchema.index({ runningService: 1, pickUpDate: 1 });

// Prevent model overwrite in development
const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

module.exports = Service;
