const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../utils/multer');

// Accepts single file upload with fieldname 'pdf'
router.post('/', upload.single('pdf'), uploadController.uploadFile);

module.exports = router;
