import { auth } from '../utils/api';

class AuthService {
  async login(email, password) {
    try {
      const response = await auth.login({ email, password });
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await auth.register(userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async updateProfile(data) {
    try {
      const response = await auth.updateProfile(data);
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      await auth.changePassword({ currentPassword, newPassword });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(email) {
    try {
      await auth.forgotPassword(email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token, password) {
    try {
      await auth.resetPassword(token, password);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  handleError(error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message: 'No response from server. Please check your internet connection.',
        status: 0,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        message: error.message || 'Network error occurred',
        status: 500,
      };
    }
  }
}


const authServiceInstance = new AuthService();
export default authServiceInstance;