const express = require('express');
const router = express.Router();
const { register, getAdminById } = require('../controllers/adminController');

// POST request to register a new user
router.post('/admin/register', register);

router.get('/admin' ,getAdminById);

module.exports = router;
