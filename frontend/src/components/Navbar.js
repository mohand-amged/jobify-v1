import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdown and menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-text">Jobify</span>
          <span className="logo-dot">.</span>
        </Link>

        <div className="nav-links">
          <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>
            <span className="nav-link-icon">🔍</span>
            Find Jobs
          </Link>
          {user?.role === 'recruiter' && (
            <Link to="/post-job" className={`nav-link ${isActive('/post-job') ? 'active' : ''}`}>
              <span className="nav-link-icon">✚</span>
              Post a Job
            </Link>
          )}
          {user && (
            <Link to="/saved-jobs" className={`nav-link ${isActive('/saved-jobs') ? 'active' : ''}`}>
              <span className="nav-link-icon">♥</span>
              Saved Jobs
            </Link>
          )}
        </div>

        <div className="nav-auth" ref={dropdownRef}>
          {user ? (
            <div className="profile-menu">
              <button 
                className="profile-button" 
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-label="User menu"
              >
                <div className="profile-icon">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 
                   user.company?.name.charAt(0).toUpperCase()}
                </div>
                <span className="profile-name">
                  {user.firstName ? `${user.firstName}` : user.company?.name}
                </span>
              </button>
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <p className="user-name">
                      {user.firstName ? `${user.firstName} ${user.lastName}` : user.company?.name}
                    </p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="dropdown-items">
                    <Link 
                      to={user.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/jobseeker'}
                      className="dropdown-item"
                    >
                      <span className="dropdown-icon">📊</span>
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile"
                      className="dropdown-item"
                    >
                      <span className="dropdown-icon">⚙️</span>
                      Profile Settings
                    </Link>
                    {user.role === 'recruiter' && (
                      <Link 
                        to="/manage-jobs"
                        className="dropdown-item"
                      >
                        <span className="dropdown-icon">📝</span>
                        Manage Jobs
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <span className="dropdown-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="register-button">
                Register
              </Link>
            </div>
          )}
        </div>

        <button 
          className={`mobile-menu-button ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          <span className="menu-icon"></span>
        </button>

        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} ref={menuRef}>
          <div className="mobile-menu-content">
            <Link to="/jobs" className="mobile-link">
              <span className="mobile-icon">🔍</span>
              Find Jobs
            </Link>
            {user?.role === 'recruiter' && (
              <Link to="/post-job" className="mobile-link">
                <span className="mobile-icon">✚</span>
                Post a Job
              </Link>
            )}
            {user ? (
              <>
                <Link to="/saved-jobs" className="mobile-link">
                  <span className="mobile-icon">♥</span>
                  Saved Jobs
                </Link>
                <Link to="/profile" className="mobile-link">
                  <span className="mobile-icon">👤</span>
                  Profile
                </Link>
                <Link to="/applications" className="mobile-link">
                  <span className="mobile-icon">📑</span>
                  My Applications
                </Link>
                <button onClick={handleLogout} className="mobile-link logout">
                  <span className="mobile-icon">🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link">
                  <span className="mobile-icon">🔑</span>
                  Login
                </Link>
                <Link to="/register" className="mobile-link">
                  <span className="mobile-icon">✍️</span>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 