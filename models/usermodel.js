const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: false,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Username is required"],
    minlength: [6, "Username must have at least 6 characters"],
  },
  age: {
    type: Number,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Regular expression for email validation
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must have at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient",
  },
  dob: {
    type: Date,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
    default:
      "https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png",
  },
  city: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
