import React, { createContext, useState, useContext } from 'react';
import { jobAPI } from '../utils/api';
import { useToast } from './ToastContext';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    page: 1,
    limit: 10
  });
  const { showToast } = useToast();

  const getJobs = async (filterParams = filters) => {
    setLoading(true);
    try {
      const response = await jobAPI.getJobs(filterParams);
      setJobs(response.data.jobs);
      return { success: true, jobs: response.data.jobs, total: response.data.total };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch jobs';
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getJobById = async (jobId) => {
    setLoading(true);
    try {
      const response = await jobAPI.getJobById(jobId);
      return { success: true, job: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch job details';
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      const response = await jobAPI.createJob(jobData);
      setJobs([response.data, ...jobs]);
      showToast('Job posted successfully!', 'success');
      return { success: true, job: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create job';
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const updateJob = async (jobId, jobData) => {
    try {
      const response = await jobAPI.updateJob(jobId, jobData);
      setJobs(jobs.map(job => job._id === jobId ? response.data : job));
      showToast('Job updated successfully!', 'success');
      return { success: true, job: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update job';
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await jobAPI.deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      showToast('Job deleted successfully!', 'success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete job';
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const applyToJob = async (jobId, applicationData) => {
    try {
      const response = await jobAPI.applyToJob(jobId, applicationData);
      showToast('Application submitted successfully!', 'success');
      return { success: true, application: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const value = {
    jobs,
    loading,
    filters,
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
    updateFilters
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}; 