const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2e54538f5f451633b71e39f957cf01";
const Cred = require("../model/cred")

const register = async (req, res) => {
    const { username, password, role } = req.body;

    // Validate role
    const allowedRoles = ["admin", "customer"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).send(`Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`);
    }

    //hash password and saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const cred = new Cred({ username, password: hashedPassword, role })
    cred.save();
    res.status(201).send(cred);
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const cred = await Cred.findOne({ username });
    if (!cred || !(await bcrypt.compare(password, cred.password))) {
        return res.status(403).send('Invalid username or password');
    }

    const token = jwt.sign({ username: cred.username, role: cred.role },
        SECRET_KEY,
        { expiresIn: '2h' });
    res.json({ token });

};

module.exports = {
    login,
    register
}