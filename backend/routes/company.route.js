const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');
const {
    upsertCompany,
    getCompany,
    getCompanyById,
    getCompanyStats,
    uploadLogo
} = require('../controllers/company.controller');
const { protect, authorize, requireEmailVerification } = require('../middleware/auth.middleware');

// Configure multer for logo upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/company-logos');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Validation middleware
const companyValidation = [
    check('name', 'Company name is required').not().isEmpty(),
    check('industry', 'Industry is required').not().isEmpty(),
    check('size', 'Company size is required').isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
    check('location', 'Location is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty().isLength({ max: 1000 }),
    check('website', 'Please enter a valid URL').optional().isURL()
];

// Public routes
router.get('/companies/:id', getCompanyById);

// Protected routes
router.post(
    '/companies',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    companyValidation,
    upsertCompany
);

router.put(
    '/companies',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    companyValidation,
    upsertCompany
);

router.get(
    '/companies/profile',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    getCompany
);

router.get(
    '/companies/stats',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    getCompanyStats
);

router.post(
    '/companies/logo',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    upload.single('logo'),
    uploadLogo
);

module.exports = router; 