/** @format */

// Import the mongoose module from node_modules
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Defining a Model and Creating a Database Schema
// define user schema
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
		type: String,
		required: [true, "Please provide first name"],
		maxLength: 10,
		minlength: 3,
	},
  lastName: {
		type: String,
		required: [true, "Please provide last name"],
		maxLength: 10,
		minlength: 3,
	},
  email: {
		type: String,
		required: [true, "Please provide email"],
		unique: true,
    // a regular expression to validate an email address(stackoverflow)
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      "Please provide a valid email",
    ]
    },
  password: {
		type: String,
		required: true,
    required: [true, "Please provide password"],
		minlength: 6,
		maxLength: 40,
	},
  confirmPassword: {
		type: String,
		required: [true, "Please provide confirmed Password"],
		minlength: 6,
		maxLength: 40,
	},
  dateOfBirth: {
		type: Number,
		maxLength: 5,
	},
  gender: { type: String },
  joinedDate: {
		type: Date,
		default: new Date(),
	},
  cart: {
		items: [
      {
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product", // add relationship
					required: [true, "Please provide Product"],
				},
        quantity: {
					type: Number,
					required: [true, "Please provide quantity"],
				},
			},
    ]
  }
});

// Pre Save Hook. Generate hashed password
userSchema.pre("save", async function (next) {
  // Check if this is new account or password is modfied
  if (!this.isModified("password")) {
		// if the password is not modfied then continue
	} else {
    const salt = await bcrypt.genSalt(12);
		this.password = await bcrypt.hash(this.password, salt);
	}
});

// Create JWT token for the user
userSchema.methods.createJWT = function () {
  const payload = {
		userId: this._id,
		email: this.email,
	};

  return jwt.sign(payload, process.env.TOKEN_SECRET, {
		expiresIn: process.env.JWT_EXPIRE_TIME,
	});
};

// Compare passwords
userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
	return isMatch;
};

// Export Model
// Compile model from userSchema
module.exports = mongoose.model("User", userSchema);
