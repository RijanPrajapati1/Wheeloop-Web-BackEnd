const express = require("express")
const router = express.Router()

const { login, register } = require("../controller/cred_controller")
const { authenticateToken, authorizeRole } = require("../security/auth")


router.post("/login", login);
// router.post("/register", authenticateToken, register); //use here authenticate token after gettign token once
router.post("/register", register);

// Admin-specific route
router.get("/admin-data", authenticateToken, authorizeRole("admin"), (req, res) => {
    res.send("Admin-specific data: You have admin access!");
});


// Customer-specific route
router.get("/customer-data", authenticateToken, authorizeRole("customer"), (req, res) => {
    res.send("Customer-specific data: Welcome, customer!");
});


module.exports = router;