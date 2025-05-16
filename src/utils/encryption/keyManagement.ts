
/**
 * Utility functions for managing encryption keys
 */

import { bufferToBase64, base64ToBuffer } from './encodingUtils';

/**
 * Generates a new AES-GCM encryption key
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true, // extractable - making key extractable to fix the error
    ['encrypt', 'decrypt']
  );
}

/**
 * Exports a CryptoKey to a base64 string for storage
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  return bufferToBase64(new Uint8Array(exportedKey));
}

/**
 * Imports a base64 string key back to a CryptoKey object
 */
export async function importKey(keyData: string): Promise<CryptoKey> {
  const keyBuffer = base64ToBuffer(keyData);
  return window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: 'AES-GCM',
      length: 256
    },
    true, // extractable - making key extractable to fix the error
    ['encrypt', 'decrypt']
  );
}

// Local storage key prefix
const KEY_STORAGE_PREFIX = 'encryption_key_';

/**
 * Sets up encryption for a user, generating and storing keys
 */
export async function setupUserEncryption(userId: string): Promise<string> {
  const key = await generateEncryptionKey();
  const exportedKey = await exportKey(key);
  
  // Store the key in local storage with the user ID
  localStorage.setItem(`${KEY_STORAGE_PREFIX}${userId}`, exportedKey);
  
  return exportedKey;
}

/**
 * Retrieves the encryption key for a specific user
 */
export function retrieveEncryptionKey(userId: string): string | null {
  return localStorage.getItem(`${KEY_STORAGE_PREFIX}${userId}`);
}

/**
 * Removes the encryption key for a specific user
 */
export function clearEncryptionKey(userId: string): void {
  localStorage.removeItem(`${KEY_STORAGE_PREFIX}${userId}`);
}
