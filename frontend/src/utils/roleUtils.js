import { jwtDecode } from 'jwt-decode';

/**
 * Get the current user data from JWT token stored in localStorage
 * @returns {Object|null} User object with id, email, role or null if no token
 */
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if the current user has the 'official' role
 * @returns {boolean} True if user is an official
 */
export const isOfficial = () => {
  const user = getCurrentUser();
  return user?.role === 'official' || user?.role === 'admin';
};

/**
 * Check if the current user has the 'citizen' role
 * @returns {boolean} True if user is a citizen
 */
export const isCitizen = () => {
  const user = getCurrentUser();
  return user?.role === 'citizen';
};

/**
 * Check if the current user has the 'admin' role
 * @returns {boolean} True if user is an admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

/**
 * Get the current user's role
 * @returns {string|null} Role string or null if no user
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
