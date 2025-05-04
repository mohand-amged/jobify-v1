import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobs } from '../utils/api';
import '../styles/JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await jobs.getById(id);
        setJob(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!job) {
    return <div className="not-found">Job not found</div>;
  }

  return (
    <div className="job-details-container">
      <div className="job-details-header">
        <Link to="/jobs" className="back-button">
          ← Back to Jobs
        </Link>
        <div className="company-info">
          <div className="company-logo">{job.companyLogo || '🏢'}</div>
          <div className="company-details">
            <h1>{job.title}</h1>
            <h2>{job.company}</h2>
          </div>
        </div>
        <div className="job-meta">
          <div className="meta-item">
            <i className="location-icon">📍</i>
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <i className="type-icon">💼</i>
            <span>{job.type}</span>
          </div>
          <div className="meta-item">
            <i className="salary-icon">💰</i>
            <span>{job.salary}</span>
          </div>
          <div className="meta-item">
            <i className="experience-icon">⭐</i>
            <span>{job.experience}</span>
          </div>
          <div className="meta-item">
            <i className="posted-icon">📅</i>
            <span>Posted {job.posted}</span>
          </div>
        </div>
      </div>

      <div className="job-details-content">
        <div className="main-content">
          <section className="job-description">
            <h3>Job Description</h3>
            <div className="description-text">
              {job.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="required-skills">
            <h3>Required Skills</h3>
            <div className="skills-list">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="action-sidebar">
          <button className="apply-button">Apply Now</button>
          <button className="save-button">Save Job</button>
          <div className="share-section">
            <h4>Share this job</h4>
            <div className="share-buttons">
              <button className="share-button">LinkedIn</button>
              <button className="share-button">Twitter</button>
              <button className="share-button">Email</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
