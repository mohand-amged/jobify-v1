// import required modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const jobRoutes = require("./routes/job.route");
const jobApplicationRoutes = require("./routes/JobApplication.route");
const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Allow only the specified frontend URL
};

// config env
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors(corsOptions));

// mongodb connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// Routes for authentication
app.use("/api/auth", authRoutes);

// Routes for user profile and management
app.use("/api/user", userRoutes);

// Routes for jobs
app.use("/api/jobs", jobRoutes);

// Routes for job applications
app.use("/api/job-applications", jobApplicationRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log(`- Auth: http://localhost:${PORT}/api/auth`);
    console.log(`- Users: http://localhost:${PORT}/api/user`);
    console.log(`- Jobs: http://localhost:${PORT}/api/jobs`);
    console.log(`- Applications: http://localhost:${PORT}/api/job-applications`);
});