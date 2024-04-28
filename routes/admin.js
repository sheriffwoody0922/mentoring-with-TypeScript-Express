/** @format */

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const userController = require("../controllers/users.controller");


// API Endpoint for Handling Get Request to /api/admin/users
router.get("/users", adminController.admin_get_all_user);

// API Endpoint for Handling Post Request to /api/admin/users
router.post("/users", userController.user_signup);

module.exports = router;
