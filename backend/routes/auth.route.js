const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
    register,
    login,
    getCurrentUser
} = require('../controllers/auth.controller');

// Register user
router.post('/register', [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role').optional().isIn(['user', 'recruiter'])
], register);

// Login user
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], login);

// Get current user
router.get('/me', protect, getCurrentUser);

module.exports = router; 