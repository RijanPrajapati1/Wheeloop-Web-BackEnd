const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Cred = require("../model/cred");
const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2e54538f5f451633b71e39f957cf01";

// Register Controller
const register = async (req, res) => {
    console.log("Register request received", req.body);
    const { email, password, role, full_name, address, phone_number } = req.body;

    const allowedRoles = ["admin", "customer"];
    if (!allowedRoles.includes(role)) {
        console.log("Invalid role attempted", role);
        return res.status(400).send(`Invalid role. Allowed roles: ${allowedRoles.join(", ")}`);
    }

    const existingCred = await Cred.findOne({ email });
    if (existingCred) {
        console.log("Registration failed: Email already registered", email);
        return res.status(400).send("Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cred = new Cred({ email, password: hashedPassword, role, full_name, address, phone_number });

    try {
        await cred.save();
        console.log("User registered successfully", email);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "rijanpraz@gmail.com",
                pass: "hnbyxbgpqqtrwkci"
            }
        });

        const info = await transporter.sendMail({
            from: "rijanpraz@gmail.com",
            to: cred.email,
            subject: "Registration Successful",
            html: `<h1>Registration Successful</h1><p>Dear ${cred.full_name}, Your account has been created.</p>`
        });
        console.log("Email sent successfully to", cred.email);

        res.status(201).send({ message: "You have successfully registered.", user: cred, emailInfo: info });
    } catch (e) {
        console.error("Error during registration", e);
        res.status(500).json(e);
    }
};

// Verify Email Controller
const verifyEmail = async (req, res) => {
    console.log("Email verification request received", req.query);
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decoded token", decoded);
        const user = await Cred.findOne({ email: decoded.email });

        if (!user) {
            console.log("Email verification failed: User not found", decoded.email);
            return res.status(404).send("User not found.");
        }

        user.isVerified = true;
        await user.save();
        console.log("Email verified successfully", decoded.email);
        res.status(200).send("Email verified successfully.");
    } catch (e) {
        console.error("Email verification error", e);
        res.status(400).send("Invalid or expired token.");
    }
};

// Login Controller
const login = async (req, res) => {
    console.log("Login request received", req.body);
    const { email, password } = req.body;
    const cred = await Cred.findOne({ email });

    if (!cred) {
        console.log("Login failed: Email not found", email);
        return res.status(403).send('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, cred.password);
    if (!validPassword) {
        console.log("Login failed: Incorrect password", email);
        return res.status(403).send('Invalid email or password');
    }

    const token = jwt.sign({ email: cred.email, role: cred.role }, SECRET_KEY, { expiresIn: '24h' });
    console.log("Login successful", email);
    res.json({ token, role: cred.role });
};

// Other CRUD operations with logs
const findAll = async (req, res) => {
    try {
        const users = await Cred.find();
        console.log("Retrieved all users", users.length);
        res.status(200).json(users);
    } catch (e) {
        console.error("Error fetching users", e);
        res.status(500).json(e);
    }
};

const findById = async (req, res) => {
    try {
        const user = await Cred.findById(req.params.id);
        if (!user) {
            console.log("User not found", req.params.id);
            return res.status(404).send("User not found");
        }
        console.log("User retrieved", user);
        res.status(200).json(user);
    } catch (e) {
        console.error("Error fetching user", e);
        res.status(500).json(e);
    }
};

const update = async (req, res) => {
    try {
        const updatedUser = await Cred.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            console.log("User not found for update", req.params.id);
            return res.status(404).send("User not found");
        }
        console.log("User updated successfully", updatedUser);
        res.status(202).json(updatedUser);
    } catch (e) {
        console.error("Error updating user", e);
        res.status(500).json(e);
    }
};

const deleteById = async (req, res) => {
    try {
        const deletedUser = await Cred.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            console.log("User not found for deletion", req.params.id);
            return res.status(404).send("User not found");
        }
        console.log("User deleted successfully", req.params.id);
        res.status(200).send("User deleted");
    } catch (e) {
        console.error("Error deleting user", e);
        res.status(500).json(e);
    }
};

module.exports = { login, register, verifyEmail, findAll, findById, update, deleteById };