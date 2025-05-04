import { jobs } from '../utils/api';

class JobService {
  async getAllJobs(params = {}) {
    try {
      const response = await jobs.getAll(params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getJobById(id) {
    try {
      const response = await jobs.getById(id);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createJob(jobData) {
    try {
      const response = await jobs.create(jobData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateJob(id, jobData) {
    try {
      const response = await jobs.update(id, jobData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteJob(id) {
    try {
      await jobs.delete(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async applyToJob(jobId, applicationData) {
    try {
      const response = await jobs.apply(jobId, applicationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchJobs(searchParams) {
    try {
      const response = await jobs.search(searchParams);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getJobApplications(jobId) {
    try {
      const response = await jobs.getApplications(jobId);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async saveJob(jobId) {
    try {
      const response = await jobs.save(jobId);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async unsaveJob(jobId) {
    try {
      const response = await jobs.unsave(jobId);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
      };
    }
    return {
      message: error.message || 'Network error occurred',
      status: 500,
    };
  }
}

export default new JobService(); 