
// Re-export all email-related functions from their dedicated files
export { generateTempEmail, copyToClipboard } from './emailGeneratorUtils';
export { isValidEmail } from './validationUtils';
export { 
  createTemporaryEmail, 
  getUserTemporaryEmails, 
  deleteTemporaryEmail 
} from '../services/tempEmailService';
