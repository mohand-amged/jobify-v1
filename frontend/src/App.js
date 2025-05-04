import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const JobList = lazy(() => import('./pages/JobList'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const JobSeekerDashboard = lazy(() => import('./pages/dashboard/JobSeekerDashboard'));
const RecruiterDashboard = lazy(() => import('./pages/dashboard/RecruiterDashboard'));
const PostJob = lazy(() => import('./pages/PostJob'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Suspense fallback={<LoadingSpinner size="large" />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/complete-profile" element={<CompleteProfile />} />
                  <Route path="/jobs" element={<JobList />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/dashboard" element={<JobSeekerDashboard />} />
                  <Route path="/dashboard/jobseeker" element={<JobSeekerDashboard />} />
                  <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
                  <Route path="/post-job" element={<PostJob />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
