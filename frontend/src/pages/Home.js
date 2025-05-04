import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Jobify</h1>
          <p>Your journey to the perfect job starts here</p>
          <div className="cta-buttons">
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Jobify?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Easy Job Search</h3>
            <p>Find the perfect job with our advanced search filters</p>
          </div>
          <div className="feature-card">
            <h3>Track Applications</h3>
            <p>Keep track of your job applications in one place</p>
          </div>
          <div className="feature-card">
            <h3>Career Resources</h3>
            <p>Access tools and tips to advance your career</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;  