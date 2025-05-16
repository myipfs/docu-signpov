
/**
 * Encryption and decryption utilities for data
 * Handles the actual encryption and decryption operations
 */

import { bufferToBase64, base64ToBuffer } from './encodingUtils';

// Encryption parameters
const IV_LENGTH = 12;

/**
 * Encrypts data using AES-GCM
 * Returns a string with format: base64(iv):base64(ciphertext)
 */
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Generate a random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  // Encrypt the data
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    dataBuffer
  );
  
  // Format as base64(iv):base64(ciphertext)
  return `${bufferToBase64(iv)}:${bufferToBase64(new Uint8Array(ciphertext))}`;
}

/**
 * Decrypts data that was encrypted with encryptData
 */
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  try {
    // Split the data into IV and ciphertext
    const [ivString, ciphertextString] = encryptedData.split(':');
    
    if (!ivString || !ciphertextString) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = base64ToBuffer(ivString);
    const ciphertext = base64ToBuffer(ciphertextString);
    
    // Decrypt the data
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      ciphertext
    );
    
    // Convert the decrypted data back to a string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}
