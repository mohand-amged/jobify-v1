const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resume: {
        type: String,
        required: [true, 'Resume is required']
    },
    coverLetter: {
        type: String
    },
    status: {
        type: String,
        enum: [
            'pending',
            'under-review',
            'shortlisted',
            'interview-scheduled',
            'interviewed',
            'offer-extended',
            'offer-accepted',
            'offer-declined',
            'rejected',
            'withdrawn'
        ],
        default: 'pending'
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        notes: String,
        interviewFeedback: String
    },
    interviewDetails: {
        scheduledDate: Date,
        location: String,
        interviewType: {
            type: String,
            enum: ['in-person', 'phone', 'video']
        },
        interviewers: [{
            name: String,
            position: String
        }]
    },
    answers: [{
        question: String,
        answer: String
    }],
    expectedSalary: {
        type: String
    },
    availability: {
        type: String
    },
    noticePeriod: {
        type: String
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Ensure user can only apply once to a job
jobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

// Pre-save middleware to update job's applicant count
jobApplicationSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            await mongoose.model('Job').findByIdAndUpdate(
                this.jobId,
                { $inc: { applicantCount: 1 } }
            );
        } catch (error) {
            next(error);
        }
    }
    next();
});

// Pre-remove middleware to decrease job's applicant count
jobApplicationSchema.pre('remove', async function(next) {
    try {
        await mongoose.model('Job').findByIdAndUpdate(
            this.jobId,
            { $inc: { applicantCount: -1 } }
        );
    } catch (error) {
        next(error);
    }
    next();
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication; 