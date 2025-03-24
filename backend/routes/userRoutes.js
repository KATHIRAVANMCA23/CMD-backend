const express = require('express');
const router = express.Router();
const { register, getUserById, getAllUsers, getEngineers, loginUser,getAllEngineer } = require('../controllers/userController');

// POST request to register a new user
router.post('/register', register);

// POST request to login a user
router.post("/login", loginUser);

// GET request to fetch a user by ID
router.get('/users/:id', getUserById);

// GET request to fetch all users
router.get('/users', getAllUsers);

// GET request to fetch all engineers
router.get("/engineers", getEngineers);

router.get("/engineers/:id", getEngineers);

router.get("/engineers/:id", getUserById); // Use a function that fetches by ID


module.exports = router;
