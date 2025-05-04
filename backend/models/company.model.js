const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    logo: {
        type: String,
        default: ''
    },
    industry: {
        type: String,
        required: [true, 'Industry is required'],
        trim: true
    },
    size: {
        type: String,
        required: [true, 'Company size is required'],
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    website: {
        type: String,
        trim: true,
        match: [
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            'Please enter a valid URL'
        ]
    },
    description: {
        type: String,
        required: [true, 'Company description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String
    },
    benefits: [{
        type: String,
        trim: true
    }],
    culture: {
        type: String,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add text indexes for search
companySchema.index({
    name: 'text',
    description: 'text',
    industry: 'text'
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company; 