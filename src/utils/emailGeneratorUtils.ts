
/**
 * Generates a random temporary email address
 * @returns {string} A randomly generated temporary email address
 */
export const generateTempEmail = () => {
  const random = Math.random().toString(36).substring(2, 10);
  return `temp-${random}@signdocs.temp`;
};

/**
 * Copies text to clipboard
 * @param {string} text The text to copy
 */
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .catch(err => console.error('Failed to copy text: ', err));
};
