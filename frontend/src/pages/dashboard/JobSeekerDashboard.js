import React, { useState } from 'react';
import '../../styles/Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Navigate } from 'react-router-dom';

const JobSeekerDashboard = () => {
  const { user, loading } = useAuth();
  
  const [applications] = useState([
    {
      id: 1,
      company: 'Tech Corp',
      position: 'Senior Developer',
      status: 'Under Review',
      appliedDate: '2024-03-15'
    },
    {
      id: 2,
      company: 'Innovation Labs',
      position: 'Full Stack Developer',
      status: 'Interviewed',
      appliedDate: '2024-03-10'
    }
  ]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.firstName}!</h1>
        <button className="edit-profile-btn">Edit Profile</button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card profile-card">
          <h2>Profile Overview</h2>
          <div className="profile-info">
            <div className="profile-avatar">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="profile-details">
              <h3>{user.firstName} {user.lastName}</h3>
              <p className="title">{user.title || 'Add your title'}</p>
              <p className="location">{user.location || 'Add your location'}</p>
              <p className="experience">Experience: {user.experience || 'Add your experience'}</p>
            </div>
          </div>
          <div className="skills-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {(user.skills || []).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
              {(!user.skills || user.skills.length === 0) && (
                <p>Add your skills</p>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card applications-card">
          <h2>Recent Applications</h2>
          <div className="applications-list">
            {applications.map(application => (
              <div key={application.id} className="application-item">
                <div className="application-header">
                  <h3>{application.position}</h3>
                  <span className={`status-badge ${application.status.toLowerCase().replace(' ', '-')}`}>
                    {application.status}
                  </span>
                </div>
                <p className="company-name">{application.company}</p>
                <p className="application-date">Applied on: {application.appliedDate}</p>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Applications</button>
        </div>

        <div className="dashboard-card stats-card">
          <h2>Your Activity</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>5</h3>
              <p>Active Applications</p>
            </div>
            <div className="stat-item">
              <h3>3</h3>
              <p>Interviews Scheduled</p>
            </div>
            <div className="stat-item">
              <h3>12</h3>
              <p>Saved Jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard; 