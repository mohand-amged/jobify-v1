const JobApplication = require('../models/JobApplication.model');
const Job = require('../models/job.model');
const { validationResult } = require('express-validator');

// Submit a job application
const submitApplication = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobId } = req.params;
        const {
            coverLetter,
            expectedSalary,
            availability,
            noticePeriod,
            answers
        } = req.body;

        // Check if job exists and is still accepting applications
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.status !== 'published') {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer accepting applications'
            });
        }

        // Check if user has already applied
        const existingApplication = await JobApplication.findOne({
            jobId,
            userId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Create application
        const application = await JobApplication.create({
            jobId,
            userId: req.user._id,
            resume: req.file ? req.file.path : null,
            coverLetter,
            expectedSalary,
            availability,
            noticePeriod,
            answers
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
};

// Update application status (for employers)
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, feedback, interviewDetails } = req.body;

        const application = await JobApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify employer owns the job
        const job = await Job.findById(application.jobId);
        if (job.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application'
            });
        }

        // Update application
        application.status = status;
        if (feedback) {
            application.feedback = feedback;
        }
        if (interviewDetails) {
            application.interviewDetails = interviewDetails;
        }
        application.lastUpdated = Date.now();

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
};

// Get applications for a job (for employers)
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { 
            status, 
            sort = '-appliedDate',
            page = 1,
            limit = 10,
            search
        } = req.query;

        // Verify employer owns the job
        const job = await Job.findById(jobId);
        if (!job || job.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these applications'
            });
        }

        // Build query
        const query = { jobId };
        if (status) {
            query.status = status;
        }

        // Add search functionality
        if (search) {
            query['$or'] = [
                { 'notes': { $regex: search, $options: 'i' } },
                { 'coverLetter': { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get total count for pagination
        const total = await JobApplication.countDocuments(query);

        const applications = await JobApplication.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'name email')
            .exec();

        res.status(200).json({
            success: true,
            count: applications.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// Get user's applications (for job seekers)
const getUserApplications = async (req, res) => {
    try {
        const { 
            status, 
            sort = '-appliedDate',
            page = 1,
            limit = 10,
            search,
            dateFrom,
            dateTo
        } = req.query;

        // Build query
        const query = { userId: req.user._id };
        if (status) {
            query.status = status;
        }

        // Add date range filter
        if (dateFrom || dateTo) {
            query.appliedDate = {};
            if (dateFrom) {
                query.appliedDate.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                query.appliedDate.$lte = new Date(dateTo);
            }
        }

        // Add search functionality
        if (search) {
            query['$or'] = [
                { 'notes': { $regex: search, $options: 'i' } },
                { 'coverLetter': { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get total count for pagination
        const total = await JobApplication.countDocuments(query);

        const applications = await JobApplication.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('jobId', 'title company location')
            .exec();

        res.status(200).json({
            success: true,
            count: applications.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// Get application details
const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await JobApplication.findById(applicationId)
            .populate('jobId', 'title company location')
            .populate('userId', 'name email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check authorization
        const isEmployer = application.jobId.userId.toString() === req.user._id.toString();
        const isApplicant = application.userId._id.toString() === req.user._id.toString();

        if (!isEmployer && !isApplicant) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this application'
            });
        }

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching application details',
            error: error.message
        });
    }
};

// Withdraw job application
const withdrawApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { withdrawalReason } = req.body;

        const application = await JobApplication.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify the application belongs to the user
        if (application.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to withdraw this application'
            });
        }

        // Check if application is in a state that can be withdrawn
        const withdrawableStates = ['pending', 'under-review', 'shortlisted', 'interview-scheduled'];
        if (!withdrawableStates.includes(application.status)) {
            return res.status(400).json({
                success: false,
                message: 'Application cannot be withdrawn in its current state'
            });
        }

        // Update application status to withdrawn
        application.status = 'withdrawn';
        application.notes = withdrawalReason || 'No reason provided';
        application.lastUpdated = Date.now();

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Application withdrawn successfully',
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error withdrawing application',
            error: error.message
        });
    }
};

module.exports = {
    submitApplication,
    updateApplicationStatus,
    getJobApplications,
    getUserApplications,
    getApplicationDetails,
    withdrawApplication
};

