const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');
const {
    submitApplication,
    updateApplicationStatus,
    getJobApplications,
    getUserApplications,
    getApplicationDetails,
    withdrawApplication
} = require('../controllers/jobApplication.controller');
const { protect, authorize, requireEmailVerification } = require('../middleware/auth.middleware');

// Configure multer for resume upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .pdf, .doc and .docx format allowed!'));
    }
});

// Validation middleware
const applicationValidation = [
    check('coverLetter').optional().isString(),
    check('expectedSalary').optional().isString(),
    check('availability').optional().isString(),
    check('noticePeriod').optional().isString(),
    check('answers').optional().isArray()
];

const statusUpdateValidation = [
    check('status').isIn([
        'pending',
        'under-review',
        'shortlisted',
        'interview-scheduled',
        'interviewed',
        'offer-extended',
        'offer-accepted',
        'offer-declined',
        'rejected'
    ]),
    check('feedback').optional().isObject(),
    check('interviewDetails').optional().isObject()
];

// Routes for job seekers
router.post(
    '/jobs/:jobId/apply',
    protect,
    requireEmailVerification,
    authorize('job-seeker'),
    upload.single('resume'),
    applicationValidation,
    submitApplication
);

router.get(
    '/applications/me',
    protect,
    requireEmailVerification,
    authorize('job-seeker'),
    getUserApplications
);

router.post(
    '/applications/:applicationId/withdraw',
    protect,
    requireEmailVerification,
    authorize('job-seeker'),
    [
        check('withdrawalReason').optional().isString().trim()
    ],
    withdrawApplication
);

// Routes for employers
router.get(
    '/jobs/:jobId/applications',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    getJobApplications
);

router.put(
    '/applications/:applicationId/status',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    statusUpdateValidation,
    updateApplicationStatus
);

// Common routes
router.get(
    '/applications/:applicationId',
    protect,
    requireEmailVerification,
    getApplicationDetails
);

module.exports = router;
