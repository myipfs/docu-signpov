
/**
 * Validates if a string is a properly formatted email
 * @param {string} email The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
