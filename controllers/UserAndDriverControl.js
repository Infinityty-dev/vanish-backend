const bcrypt = require("bcrypt");
const userModel = require("../models/UserModel.js");
const driverModel = require("../models/DriverModel.js")
const jwt = require('jsonwebtoken')
require('dotenv').config()

// User Sign Up

const userSignUp = async (req, res) => {
  try {
    const { name, email, phone, password, TandC } = req.body;

    // Input Validation
    if (!name || !email || !phone || !password || TandC != true ) {
      return res.status(400).json({
        message: "Please provide name, email, phone, password, and agree to the Terms and Conditions.",
        error: true,
        success: false,
      });
      
    }
  

    // Check if email already exists
    const existingUser = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists.",
        error: true,
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      TandC,
      isVerified: false,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      success: true,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      message: "Server Error. Please try again later.",
      error: true,
      success: false,
    });
  }
};

//******************************************************************************************************************************** */

const userSignIn = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email, and password.",
                error: true,
                success: false,
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Email not found. Please sign up first.",
                error: true,
                success: false,
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                error: true,
                success: false,
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,  // Use environment variable
            { expiresIn: "7d" }
        );

        // Exclude password from response
        const { password: _, ...userData } = user._doc;

        return res.status(200).json({
            message: "Sign in successful.",
            success: true,
            data: { ...userData, token },
        });

    } catch (error) {
        console.error("Sign in error:", error.message);
        return res.status(500).json({
            message: error.message || "Sign in unsuccessful.",
            error: true,
            success: false,
        });
    }
};


//********************************************************************************************************************************* */


const driverSignUp = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            TandC,
            carType,
            driverLicenceNumber,
            licenceType
        } = req.body;

        // Validate inputs using an array
        const requiredFields = [
            { field: name, name: "Full Name" },
            { field: email, name: "Email" },
            { field: phone, name: "Phone" },
            { field: password, name: "Password" },
            { field: TandC, name: "Terms and Conditions" },
            { field: carType, name: "Car Type" },
            { field: driverLicenceNumber, name: "Driver Licence Number" },
            { field: licenceType, name: "Licence Type" }
        ];

        const missingField = requiredFields.find(item => !item.field);
        if (missingField) {
            return res.status(400).json({
                message: `Please provide ${missingField.name}.`,
                error: true,
                success: false
            });
        }

        // Ensure Terms and Conditions is accepted
        if (TandC !== true) {
            return res.status(400).json({
                message: "You must agree to the Terms and Conditions.",
                error: true,
                success: false
            });
        }

        // Check if the email already exists
        const existingDriver = await driverModel.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({
                message: "Email already exists.",
                error: true,
                success: false
            });
        }

        // Hash the password
        const driverHashedPassword = await bcrypt.hash(password, 10);

        // Create a new driver
        const newDriver = new driverModel({
            name,
            email,
            phone,
            password: driverHashedPassword,
            TandC,
            carType,
            driverLicenceNumber,
            licenceType
        });

        // Save the driver to the database
        const savedDriver = await newDriver.save();

        return res.status(201).json({
            message: "Driver registered successfully.",
            data: savedDriver,
            success: true
        });

    } catch (error) {
        console.error("Driver SignUp Error:", error.message);
        return res.status(500).json({
            message: error.message || "Sign up unsuccessful.",
            error: true,
            success: false
        });
    }
};



//************************************************************************************************************************** */


const driverSignIn = async (req, res) => {
    try {
        const {name, email, password } = req.body;

        // Validate inputs
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password.",
                error: true,
                success: false
            });
        }

        // Check if the driver exists
        const driver = await driverModel.findOne({ email });
        if (!driver) {
            return res.status(401).json({
                message: "Invalid email or password.",
                error: true,
                success: false
            });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, driver.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password.",
                error: true,
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { _id: driver._id },
            process.env.JWT_SECRET || "defaultSecret",
            { expiresIn: "7d" }
        );

        // Exclude the password from the response
        const { password: _, ...driverData } = driver._doc;

        return res.status(200).json({
            message: "Sign in successful.",
            data: { ...driverData, token },
            success: true
        });

    } catch (error) {
        console.error("Driver Sign-In Error:", error.message);
        return res.status(500).json({
            message: error.message || "Sign in was unsuccessful.",
            error: true,
            success: false
        });
    }
};


module.exports = {userSignUp, userSignIn ,driverSignUp,driverSignIn};
