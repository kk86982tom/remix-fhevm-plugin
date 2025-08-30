import { encryptU32 } from './fhevm';

/**
 * Encrypt an amount value for confidential transfers
 */
export async function encryptAmount(amount: number): Promise<Uint8Array> {
  try {
    return await encryptU32(amount);
  } catch (error) {
    console.error('Failed to encrypt amount:', error);
    throw new Error(`Amount encryption failed: ${error}`);
  }
}

/**
 * Encrypt a token ID for confidential NFTs
 */
export async function encryptTokenId(id: number): Promise<Uint8Array> {
  try {
    return await encryptU32(id);
  } catch (error) {
    console.error('Failed to encrypt token ID:', error);
    throw new Error(`Token ID encryption failed: ${error}`);
  }
}

/**
 * Decrypt result from FHEVM gateway response
 * TODO: Implement actual decryption via Relayer/Gateway and ACL
 */
export async function decryptResult(payload: Uint8Array | string): Promise<number | unknown> {
  console.warn('TODO: Implement actual decryption via FHEVM Relayer/Gateway');
  
  // Placeholder implementation - real decryption requires:
  // 1. FHEVM Gateway/Relayer integration
  // 2. Access Control List (ACL) verification  
  // 3. Proper decryption key management
  
  if (typeof payload === 'string') {
    try {
      // Try to parse as JSON if it's a string
      const parsed = JSON.parse(payload);
      return parsed.value || 0; // Placeholder return
    } catch {
      return 0; // Default fallback
    }
  }
  
  if (payload instanceof Uint8Array) {
    // Placeholder: return first 4 bytes as number for demo
    const view = new DataView(payload.buffer);
    return payload.length >= 4 ? view.getUint32(0, false) : 0;
  }
  
  return 0; // Default fallback
}

/**
 * Utility: Convert Uint8Array to hex string for display/storage
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Utility: Convert hex string back to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(bytes);
}