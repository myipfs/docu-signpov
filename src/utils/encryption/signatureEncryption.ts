
/**
 * Specialized encryption functions for handling signatures
 */

import { importKey } from './keyManagement';
import { encryptData, decryptData } from './dataEncryption';
import { retrieveEncryptionKey, setupUserEncryption } from './keyManagement';

/**
 * Encrypts a signature dataURL before storing it
 */
export async function encryptSignature(signatureData: string, userId: string): Promise<string> {
  const keyString = retrieveEncryptionKey(userId);
  
  if (!keyString) {
    // Set up encryption if not already set up
    await setupUserEncryption(userId);
    return encryptSignature(signatureData, userId);
  }
  
  const key = await importKey(keyString);
  return encryptData(signatureData, key);
}

/**
 * Decrypts a stored signature for display
 */
export async function decryptSignature(encryptedSignature: string, userId: string): Promise<string> {
  const keyString = retrieveEncryptionKey(userId);
  
  if (!keyString) {
    throw new Error('Encryption key not found');
  }
  
  const key = await importKey(keyString);
  return decryptData(encryptedSignature, key);
}

/**
 * Complete encryption handler for signature management
 */
export const signatureEncryption = {
  encrypt: encryptSignature,
  decrypt: decryptSignature,
  setupUser: setupUserEncryption
};
