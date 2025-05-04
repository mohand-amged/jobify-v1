const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getEmployerJobs,
    closeJob
} = require('../controllers/jobs.controller');
const { protect, authorize, requireEmailVerification } = require('../middleware/auth.middleware');

// Validation middleware
const jobValidation = [
    check('title', 'Job title is required').not().isEmpty(),
    check('company', 'Company name is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('type', 'Job type is required').isIn(['full-time', 'part-time', 'contract', 'internship']),
    check('experience', 'Experience level is required').not().isEmpty(),
    check('salary', 'Salary range is required').not().isEmpty(),
    check('description', 'Job description is required').not().isEmpty(),
    check('requirements', 'Job requirements are required').not().isEmpty(),
    check('deadline', 'Application deadline is required').isISO8601().toDate()
];

// Public routes
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);

// Employer routes - require authentication and proper role
router.post(
    '/jobs',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    jobValidation,
    createJob
);

router.put(
    '/jobs/:id',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    jobValidation,
    updateJob
);

router.delete(
    '/jobs/:id',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    deleteJob
);

// Get employer's jobs
router.get(
    '/employer/jobs',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    getEmployerJobs
);

// Close job
router.patch(
    '/jobs/:id/close',
    protect,
    requireEmailVerification,
    authorize('employer', 'admin'),
    closeJob
);

module.exports = router;
