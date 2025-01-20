const mongoose = require("mongoose");

// Define the Driver Schema
const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    //   minlength: [3, "Full name must be at least 3 characters long."],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address."],
    },
    phone: {
      type: String,
      required:true,
      unique: true,
      trim: true,
      match: [/^\+?\d{10,15}$/, "Phone number must be 11 digits."],
    },
    password: {
      type: String,
      required: true,
    //   minlength: [6, "Password must be at least 6 characters long."],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    TandC: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    carType: {
      type: String,
      trim: true,
      default: null,
    },
    carImage: {
      type: String,
      trim: true,
      default: null,
    },
    driverLicenceNumber: {
      type: String,
      trim: true,
      unique: true
    },
    licenceType: {
      type: String,
      trim: true,
      default: null,
    },
    pickUpLocation: {
      type: String,
      trim: true,
      default: null,
    },
    dropOffLocation: {
      type: String,
      trim: true,
      default: null,
    },
    userComplaint: {
      type: Number,
      default: 0,
      min: [0, "Complaint count cannot be negative."],
    },
    completedDelivery: {
      type: Number,
      default: 0,
      min: [0, "Completed deliveries cannot be negative."],
    },
    // driverAvatar: {
    //   type: String,
    //   trim: true,
    //   default: null,
    // },
    // carAvatar: {
    //   type: String,
    //   trim: true,
    //   default: null,
    // },
    // avatarID: {
    //   type: String,
    //   trim: true,
    //   default: null,
    // },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  { timestamps: true }
);

// Compile the schema into a model
const driverModel = mongoose.model("Driver", driverSchema);

module.exports = driverModel;
