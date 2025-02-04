const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Cred = require("../model/cred");
const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2e54538f5f451633b71e39f957cf01";
// Register Controller
const register = async (req, res) => {
    const { email, password, role, full_name, address, phone_number } = req.body;

    // Validate role
    const allowedRoles = ["admin", "customer"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).send(`Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`);
    }

    // Check if the email already exists
    const existingCred = await Cred.findOne({ email });
    if (existingCred) {
        return res.status(400).send("Email already registered.");
    }

    // Hash password and save user credentials
    const hashedPassword = await bcrypt.hash(password, 10);
    const cred = new Cred({
        email,
        password: hashedPassword,
        role,
        full_name,
        address,
        phone_number
    });

    try {
        await cred.save();

        // Send email notification
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "rijanpraz@gmail.com",  // Replace with your email
                pass: "hnbyxbgpqqtrwkci"      // Replace with your email password
            }
        });

        const info = await transporter.sendMail({
            from: "rijanpraz@gmail.com",
            to: cred.email,
            subject: "Registration Successful",
            html: `
                <h1>Registration Successful</h1>
                <p>Dear ${cred.full_name},</p>
                <p>Your account has been successfully created. Below are your details:</p>
                <ul>
                    <li>Email: ${cred.email}</li>
                    <li>Full Name: ${cred.full_name}</li>
                    <li>Address: ${cred.address}</li>
                    <li>Phone Number: ${cred.phone_number}</li>
                </ul>
                <p>Thank you for registering with us!</p>
            `
        });

        // Send response with user info
        res.status(201).send({
            message: "You have successfully registered.",
            user: {
                full_name: cred.full_name,
                address: cred.address,
                phone_number: cred.phone_number,
                email: cred.email
            },
            emailInfo: info
        });
    } catch (e) {
        res.status(500).json(e);
    }
};


// Email Verification Controller
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await Cred.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Here you could update the user status to "verified"
        user.isVerified = true;
        await user.save();

        res.status(200).send("Email verified successfully.");
    } catch (e) {
        res.status(400).send("Invalid or expired token.");
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;
    const cred = await Cred.findOne({ email });

    if (!cred) {
        return res.status(403).send('Invalid email or password');
    }

    // Check if user is verified
    if (!cred.isVerified) {
        return res.status(400).send('Email not verified');
    }

    const validPassword = await bcrypt.compare(password, cred.password);
    if (!validPassword) {
        return res.status(403).send('Invalid email or password');
    }

    const token = jwt.sign({ email: cred.email, role: cred.role },
        SECRET_KEY,
        { expiresIn: '24h' });

    res.json({ token });
};

// Find All users
const findAll = async (req, res) => {
    try {
        const users = await Cred.find();
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json(e);
    }
};

// Find User By ID
const findById = async (req, res) => {
    try {
        const user = await Cred.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json(e);
    }
};

// Update User
const update = async (req, res) => {
    try {
        const updatedUser = await Cred.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.status(202).json(updatedUser);
    } catch (e) {
        res.status(500).json(e);
    }
};

// Delete User
const deleteById = async (req, res) => {
    try {
        const deletedUser = await Cred.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.status(200).send("User deleted");
    } catch (e) {
        res.status(500).json(e);
    }
};

module.exports = {
    login,
    register,
    verifyEmail,
    findAll,
    findById,
    update,
    deleteById
};
