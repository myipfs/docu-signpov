
/**
 * Client-side encryption utilities using the Web Crypto API
 * This module provides functions for encrypting and decrypting data
 * before it's sent to or after it's retrieved from the server.
 */

// Key derivation parameters
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256; // bits
const ITERATIONS = 100000;

/**
 * Derives an encryption key from a password
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  // Convert password to key material
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Import the password as key material
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive the actual encryption key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random encryption key and store it securely
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: KEY_LENGTH
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Exports a CryptoKey to a base64 string for storage
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return bufferToBase64(new Uint8Array(exported));
}

/**
 * Imports a base64 string key back to a CryptoKey
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = base64ToBuffer(keyString);
  return window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

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

/**
 * Manages encryption keys in local storage
 */
export function storeEncryptionKey(key: string, userId: string): void {
  localStorage.setItem(`encryption_key_${userId}`, key);
}

export function retrieveEncryptionKey(userId: string): string | null {
  return localStorage.getItem(`encryption_key_${userId}`);
}

/**
 * Generates a password-based encryption key and stores it
 */
export async function setupUserEncryption(userId: string, password?: string): Promise<string> {
  // Use provided password or generate a random one
  const userPassword = password || generateRandomPassword(16);
  
  // Generate a random salt
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  
  // Derive the key
  const key = await deriveKey(userPassword, salt);
  
  // Export the key to a string
  const keyString = await exportKey(key);
  
  // Store the key
  storeEncryptionKey(keyString, userId);
  
  // Return the password in case it was generated
  return userPassword;
}

/**
 * Generates a cryptographically secure random password
 */
function generateRandomPassword(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
}

/**
 * Utility functions for converting between Uint8Array and base64 strings
 */
function bufferToBase64(buffer: Uint8Array): string {
  const binary = Array.from(buffer)
    .map(byte => String.fromCharCode(byte))
    .join('');
  
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return bytes;
}

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
