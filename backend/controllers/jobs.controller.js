const Job = require('../models/job.model');
const JobApplication = require('../models/JobApplication.model');
const { validationResult } = require('express-validator');

// Create a new job
const createJob = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            type,
            experience,
            salary,
            description,
            requirements,
            deadline,
            skills
        } = req.body;

        // Create job
        const job = await Job.create({
            title,
            company,
            location,
            type,
            experience,
            salary,
            description,
            requirements,
            deadline: new Date(deadline),
            skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
            userId: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
};

// Get all jobs with filters and pagination
const getAllJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            type,
            location,
            experience,
            status = 'published'
        } = req.query;

        const queryObject = { status };

        if (type) queryObject.type = type;
        if (location) queryObject.location = { $regex: location, $options: 'i' };
        if (experience) queryObject.experience = experience;

        const skip = (page - 1) * limit;

        const jobs = await Job.find(queryObject)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .populate('userId', 'name company');

        const total = await Job.countDocuments(queryObject);

        res.status(200).json({
            success: true,
            jobs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};

// Get job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id)
            .populate('userId', 'name company')
            .populate('applications');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Increment views
        job.views += 1;
        await job.save();

        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
};

// Update job
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find job and check ownership
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        // If deadline is being updated, parse it
        if (updates.deadline) {
            updates.deadline = new Date(updates.deadline);
        }

        // If skills are being updated, parse them
        if (updates.skills) {
            updates.skills = updates.skills.split(',').map(skill => skill.trim());
        }

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            job: updatedJob
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
};

// Delete job
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Find job and check ownership
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        // Delete all applications for this job
        await JobApplication.deleteMany({ jobId: id });

        // Delete the job
        await job.remove();

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
};

// Get employer's jobs
const getEmployerJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status
        } = req.query;

        const queryObject = { userId: req.user._id };
        if (status) queryObject.status = status;

        const skip = (page - 1) * limit;

        const jobs = await Job.find(queryObject)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .populate('applications');

        const total = await Job.countDocuments(queryObject);

        res.status(200).json({
            success: true,
            jobs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employer jobs',
            error: error.message
        });
    }
};

// Close job
const closeJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Find job and check ownership
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to close this job'
            });
        }

        job.status = 'closed';
        await job.save();

        res.status(200).json({
            success: true,
            message: 'Job closed successfully',
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error closing job',
            error: error.message
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getEmployerJobs,
    closeJob
};
