import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobPostings] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      applications: 24,
      status: 'Active',
      postedDate: '2024-03-01',
      deadline: '2024-04-01',
      salary: '$120,000 - $150,000',
      applicants: [
        { id: 1, name: 'John Smith', status: 'Under Review' },
        { id: 2, name: 'Sarah Johnson', status: 'Interviewed' }
      ]
    },
    {
      id: 2,
      title: 'DevOps Engineer',
      location: 'Remote',
      type: 'Full-time',
      applications: 15,
      status: 'Active',
      postedDate: '2024-03-10',
      deadline: '2024-04-10',
      salary: '$100,000 - $130,000',
      applicants: [
        { id: 3, name: 'Mike Brown', status: 'Shortlisted' },
        { id: 4, name: 'Emily Davis', status: 'Under Review' }
      ]
    }
  ]);

  const handlePostJob = () => {
    navigate('/post-job');
  };

  const handleViewApplications = (jobId) => {
    navigate(`/jobs/${jobId}/applications`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/jobs/${jobId}/edit`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.company?.name || 'Recruiter'}!</h1>
        <button className="post-job-btn" onClick={handlePostJob}>
          Post New Job
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card company-profile-card">
          <h2>Company Profile</h2>
          <div className="company-info">
            <div className="company-logo">
              {user?.company?.name?.charAt(0) || 'C'}
            </div>
            <div className="company-details">
              <h3>{user?.company?.name || 'Company Name'}</h3>
              <p className="location">{user?.company?.location || 'Location'}</p>
              <p className="industry">{user?.company?.industry || 'Industry'}</p>
              <p className="size">{user?.company?.size || 'Company Size'}</p>
            </div>
          </div>
          <div className="company-description">
            <h3>About</h3>
            <p>{user?.company?.description || 'Company description goes here'}</p>
          </div>
          <button className="edit-profile-btn">Edit Company Profile</button>
        </div>

        <div className="dashboard-card job-postings-card">
          <h2>Active Job Postings</h2>
          <div className="job-postings-list">
            {jobPostings.map(job => (
              <div key={job.id} className="job-posting-item">
                <div className="job-posting-header">
                  <h3>{job.title}</h3>
                  <span className={`status-badge ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </div>
                <div className="job-posting-details">
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{job.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{job.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Salary:</span>
                    <span className="detail-value">{job.salary}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Applications:</span>
                    <span className="detail-value highlight">{job.applications}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Posted:</span>
                    <span className="detail-value">{job.postedDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deadline:</span>
                    <span className="detail-value">{job.deadline}</span>
                  </div>
                </div>
                <div className="recent-applicants">
                  <h4>Recent Applicants</h4>
                  <div className="applicants-list">
                    {job.applicants.map(applicant => (
                      <div key={applicant.id} className="applicant-item">
                        <span className="applicant-name">{applicant.name}</span>
                        <span className={`status-badge ${applicant.status.toLowerCase().replace(' ', '-')}`}>
                          {applicant.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="job-posting-actions">
                  <button 
                    className="view-applications-btn"
                    onClick={() => handleViewApplications(job.id)}
                  >
                    View All Applications
                  </button>
                  <button 
                    className="edit-job-btn"
                    onClick={() => handleEditJob(job.id)}
                  >
                    Edit Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card stats-card">
          <h2>Recruitment Overview</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>{jobPostings.length}</h3>
              <p>Active Jobs</p>
            </div>
            <div className="stat-item">
              <h3>{jobPostings.reduce((sum, job) => sum + job.applications, 0)}</h3>
              <p>Total Applications</p>
            </div>
            <div className="stat-item">
              <h3>{jobPostings.reduce((sum, job) => 
                sum + job.applicants.filter(a => a.status === 'Interviewed').length, 0)}</h3>
              <p>Interviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard; 