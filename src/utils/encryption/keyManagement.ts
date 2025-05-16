
/**
 * Key management utilities for client-side encryption
 * Handles key derivation, generation, import/export, and storage
 */

// Key derivation parameters
const SALT_LENGTH = 16;
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
    true, // Set to true to make keys extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random encryption key
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: KEY_LENGTH
    },
    true, // Make key extractable
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
 * Manages encryption keys in local storage
 */
export function storeEncryptionKey(key: string, userId: string): void {
  localStorage.setItem(`encryption_key_${userId}`, key);
}

export function retrieveEncryptionKey(userId: string): string | null {
  return localStorage.getItem(`encryption_key_${userId}`);
}

/**
 * Sets up encryption for a new user
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
export function generateRandomPassword(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
}
