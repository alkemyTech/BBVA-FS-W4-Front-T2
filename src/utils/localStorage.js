// utils/localStorage.js

// Save user data to localStorage
export const setUserData = (user) => {
    const { userName, email, token } = user;
    localStorage.setItem('userName', userName);
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
  };
  
  // Get user data from localStorage
  export const getUserData = () => {
    return {
      userName: localStorage.getItem('userName'),
      email: localStorage.getItem('email'),
      token: localStorage.getItem('token'),
    };
  };
  
  // Clear user data from localStorage
  export const clearUserData = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
  };
  
  // Check if token is expired
  export const isTokenExpired = (token) => {
    if (!token) return true;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      const exp = payload.exp * 1000; // Convert expiration time to milliseconds
      return Date.now() > exp;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };
  