const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await userModel.getUserByUsername(username);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ user_id: user.user_id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userModel.getUserByUsername(username);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = await userModel.createUser(username, email, password);
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { username, email, password } = req.body;
    const updatedUser = await userModel.updateUser(user_id, username, email, password);
    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const deletedUser = await userModel.deleteUser(user_id);
    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await userModel.getUserById(user_id);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById
};
