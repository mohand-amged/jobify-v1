import { users } from '../utils/api';

class UserService {
  async getUserProfile() {
    try {
      const response = await users.getProfile();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserProfile(profileData) {
    try {
      const response = await users.updateProfile(profileData);
      return response.data;
    } catch (error) {
      console.error('Profile update error in service:', error);
      throw this.handleError(error);
    }
  }

  async getUserApplications() {
    try {
      const response = await users.getApplications();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSavedJobs() {
    try {
      const response = await users.getSavedJobs();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateNotificationPreferences(preferences) {
    try {
      const response = await users.updateNotificationPreferences(preferences);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNotifications() {
    try {
      const response = await users.getNotifications();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const response = await users.markNotificationAsRead(notificationId);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadResume(file) {
    try {
      const response = await users.uploadResume(file);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteResume() {
    try {
      await users.deleteResume();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    console.error('Service error details:', error);
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        details: error.response.data
      };
    }
    return {
      message: error.message || 'Network error occurred',
      status: 500
    };
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance;