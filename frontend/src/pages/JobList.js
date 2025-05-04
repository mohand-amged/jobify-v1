import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/JobList.css';

const JobList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: 'all',
    experience: 'all',
  });

  // Dummy data for demonstration
  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Corp',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      experience: '5+ years',
      posted: '2 days ago',
      description: 'We are looking for an experienced React developer to join our team...',
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      type: 'Contract',
      salary: '$80,000 - $100,000',
      experience: '3+ years',
      posted: '1 week ago',
      description: 'Seeking a talented UX designer to help create beautiful user experiences...',
    },
    // Add more dummy jobs here
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="job-list-container">
      <div className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs by title, company, or keywords"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="search-button">Search</button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, State, or Remote"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="experience">Experience</label>
            <select
              id="experience"
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
            >
              <option value="all">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
        </div>
      </div>

      <div className="jobs-grid">
        {jobs.map(job => (
          <Link to={`/jobs/${job.id}`} key={job.id} className="job-card">
            <div className="job-card-header">
              <h2>{job.title}</h2>
              <span className="company">{job.company}</span>
            </div>
            
            <div className="job-card-details">
              <div className="detail-item">
                <i className="location-icon">📍</i>
                <span>{job.location}</span>
              </div>
              <div className="detail-item">
                <i className="type-icon">💼</i>
                <span>{job.type}</span>
              </div>
              <div className="detail-item">
                <i className="salary-icon">💰</i>
                <span>{job.salary}</span>
              </div>
            </div>

            <div className="job-card-footer">
              <span className="experience">{job.experience}</span>
              <span className="posted">{job.posted}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JobList;
