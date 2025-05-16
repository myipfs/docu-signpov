
/**
 * Utility functions for encoding and decoding between different formats
 */

/**
 * Converts a Uint8Array buffer to a base64 string
 */
export function bufferToBase64(buffer: Uint8Array): string {
  const binary = Array.from(buffer)
    .map(byte => String.fromCharCode(byte))
    .join('');
  
  return btoa(binary);
}

/**
 * Converts a base64 string to a Uint8Array buffer
 */
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return bytes;
}
