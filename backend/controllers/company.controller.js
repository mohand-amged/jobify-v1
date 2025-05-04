const Company = require('../models/company.model');
const Job = require('../models/job.model');
const { validationResult } = require('express-validator');

// Create or update company profile
const upsertCompany = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            industry,
            size,
            location,
            website,
            description,
            socialMedia,
            benefits,
            culture
        } = req.body;

        let company = await Company.findOne({ userId: req.user._id });

        if (company) {
            // Update existing company
            company = await Company.findOneAndUpdate(
                { userId: req.user._id },
                {
                    name,
                    industry,
                    size,
                    location,
                    website,
                    description,
                    socialMedia,
                    benefits,
                    culture
                },
                { new: true, runValidators: true }
            );
        } else {
            // Create new company
            company = await Company.create({
                userId: req.user._id,
                name,
                industry,
                size,
                location,
                website,
                description,
                socialMedia,
                benefits,
                culture
            });
        }

        res.status(200).json({
            success: true,
            message: 'Company profile updated successfully',
            company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating company profile',
            error: error.message
        });
    }
};

// Get company profile
const getCompany = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company profile not found'
            });
        }

        res.status(200).json({
            success: true,
            company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching company profile',
            error: error.message
        });
    }
};

// Get company by ID (public)
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.status(200).json({
            success: true,
            company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching company',
            error: error.message
        });
    }
};

// Get company statistics
const getCompanyStats = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company profile not found'
            });
        }

        // Get all jobs posted by the company
        const jobs = await Job.find({ userId: req.user._id });

        // Calculate statistics
        const stats = {
            totalJobs: jobs.length,
            activeJobs: jobs.filter(job => job.status === 'published').length,
            closedJobs: jobs.filter(job => job.status === 'closed').length,
            expiredJobs: jobs.filter(job => job.status === 'expired').length,
            totalApplications: jobs.reduce((sum, job) => sum + job.applications.length, 0),
            totalViews: jobs.reduce((sum, job) => sum + job.views, 0),
            applicationsByJob: jobs.map(job => ({
                jobId: job._id,
                title: job.title,
                applications: job.applications.length,
                views: job.views,
                status: job.status
            }))
        };

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching company statistics',
            error: error.message
        });
    }
};

// Upload company logo
const uploadLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        const company = await Company.findOne({ userId: req.user._id });
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company profile not found'
            });
        }

        company.logo = req.file.path;
        await company.save();

        res.status(200).json({
            success: true,
            message: 'Logo uploaded successfully',
            logo: company.logo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading logo',
            error: error.message
        });
    }
};

module.exports = {
    upsertCompany,
    getCompany,
    getCompanyById,
    getCompanyStats,
    uploadLogo
}; 