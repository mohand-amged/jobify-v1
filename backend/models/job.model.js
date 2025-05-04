const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Job type is required'],
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time'
    },
    experience: {
        type: String,
        required: [true, 'Experience level is required'],
        trim: true
    },
    salary: {
        type: String,
        required: [true, 'Salary range is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true
    },
    requirements: {
        type: String,
        required: [true, 'Job requirements are required'],
        trim: true
    },
    deadline: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'closed', 'expired'],
        default: 'published'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobApplication'
    }],
    skills: [{
        type: String,
        trim: true
    }],
    applicantCount: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add text indexes for search functionality
jobSchema.index({
    title: 'text',
    description: 'text',
    requirements: 'text',
    company: 'text',
    location: 'text'
});

// Pre-save middleware to check deadline
jobSchema.pre('save', function(next) {
    // If deadline has passed, set status to expired
    if (this.deadline && this.deadline < new Date()) {
        this.status = 'expired';
    }
    next();
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
