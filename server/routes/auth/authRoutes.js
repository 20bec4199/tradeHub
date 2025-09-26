const express = require('express');
const { googleAuth } = require('../../controllers/auth/authController');
const { authMiddleware } = require('../../middleware/authMiddleware');
const router = express.Router();

router.route('/google').get(googleAuth);

module.exports = router;