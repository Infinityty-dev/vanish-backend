const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    //   lowercase: true,
      trim: true,
    //   match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    //   match: [/^\+?\d{10,15}$/, "Please provide a valid phone number"],
    },
    password: {
      type: String,
      required: true,
    //   minlength: [6, "Password must be at least 6 characters long"],
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
    pick_up_location: {
      type: String,
      trim: true,
    },
    drop_off_location: {
      type: String,
      trim: true,
    },
    userComplaint: {
      type: Number,
      default: 0,
    //   min: [0, "Complaint count cannot be negative"],
    },
    completedDelivery: {
      type: Number,
      default: 0,
    //   min: [0, "Completed deliveries cannot be negative"],
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarID: {
      type: String,
      default: "",
    },
    userAccount: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
