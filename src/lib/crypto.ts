/**
 * Advanced AES-GCM Encryption for credentials.
 * This is "real" client-side encryption.
 */

const ENCRYPTION_KEY_NAME = 'fsociety_vault_key';

async function getOrCreateKey(): Promise<CryptoKey | null> {
  if (typeof window === "undefined" || typeof crypto === "undefined" || !crypto.subtle) return null;

  const existingKey = localStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (existingKey) {
    const rawKey = Uint8Array.from(atob(existingKey), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Generate new 256-bit key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await crypto.subtle.exportKey('raw', key);
  const base64Key = btoa(String.fromCharCode(...new Uint8Array(exported)));
  localStorage.setItem(ENCRYPTION_KEY_NAME, base64Key);
  
  return key;
}

export async function encryptData(text: string): Promise<string> {
  try {
    const key = await getOrCreateKey();
    if (!key) return text;

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...result));
  } catch (err) {
    console.error('Encryption failed:', err);
    return text; // Fallback
  }
}

export async function decryptData(encryptedBase64: string): Promise<string> {
  try {
    const key = await getOrCreateKey();
    if (!key) return encryptedBase64;
    const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error('Decryption failed. Data might not be encrypted or key changed.', err);
    return encryptedBase64; // Return as is if decryption fails
  }
}
