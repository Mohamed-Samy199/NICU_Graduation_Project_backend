const User = require("../models/usermodel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role, dateOfBirth } =
      req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, Email and Password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must have at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (dateOfBirth) {
      if (new Date(dateOfBirth) > new Date()) {
        return res
          .status(400)
          .json({ message: "Date of birth cannot be in the future" });
      }
    }

    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid input fields" });
    }

    // Check if the user already exists in the database
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      dob: dateOfBirth,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: error.message });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid input fields" });
    }

    // Find the user in the database based on email
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "username or Password is incorrect" });
    }

    // Validate user password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "username or Password is incorrect" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "secret", {
      expiresIn: "20d",
    });

    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: error.message });
  }
};

// User logout
const logout = (req, res) => {
  // Perform logout operation (e.g., invalidate JWT token, clear session, etc.)
  res.status(200).json({ message: "User logged out successfully" });
};

// Get current user details
const me = async (req, res) => {
  try {
    // Retrieve user information from request (e.g., from JWT token, session, etc.)
    const currentUser = req.user; // Assuming user information is stored in req.user

    // get user details from database (e.g., based on user ID)
    const user = await User.findById(currentUser.userId);

    res.status(200).json({ message: "Current user details", user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user details" });
  }
};

// Get all users (admin route)
const allpatients = async (req, res) => {
  try {
    // get all users where role is patient
    const userArray = await User.find({ role: "patient" });

    res.status(200).json({ message: "All users", users: userArray });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

const fetchAllDoctors = async (req, res) => {
  try {
    // get all users where role is patient
    const userArray = await User.find({ role: "doctor" });

    res.status(200).json({ message: "All Doctors", users: userArray });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Get user by ID
const getById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Perform query to fetch user by ID from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // You can customize the response based on the user data you want to send
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ message: "User details", user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updatedData = req.body;

    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid input fields" });
    }

    // Perform query to update user by ID in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: `User with ID ${userId} updated`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete user
const remove = async (req, res) => {
  try {
    const userId = req.params.id;

    // Perform query to remove user by ID from the database
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User with ID ${userId} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// User search (additional route)
const search = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    // Perform search query based on specific criteria
    const searchResults = await User.find({
      name: { $regex: keyword, $options: "i" },
    });

    res
      .status(200)
      .json({ message: "User search results", results: searchResults });
  } catch (error) {
    res.status(500).json({ message: "Error searching users" });
  }
};

// Reset user password (additional route)
const resetPassword = (req, res) => {
  const { email } = req.body;
  // Perform password reset operation (e.g., send password reset email, generate reset token, etc.)
  res.status(200).json({ message: "Password reset email sent" });
};

// Change user password (additional route)
const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // Find the user in the database based on user ID
    const user = await User.findById(userId);

    // Validate the current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    // Update the password in the database
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
};

// Update user profile (additional route)
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email } = req.body;

    // Find the user in the database based on user ID
    const user = await User.findById(userId);

    // Update the user's profile data
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    // Save the updated user data in the database
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

// middleware to check if user is admin

module.exports = {
  register,
  login,
  logout,
  me,
  allpatients,
  fetchAllDoctors,
  getById,
  updateMyProfile,
  remove,
  search,
  resetPassword,
  changePassword,
  updateProfile,
};
