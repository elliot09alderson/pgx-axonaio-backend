class TrustlypaySecureData {
  constructor() {
    this.ivBytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    this.aesKey = '5cc34da0-8bbe-4b8c-8a55-abb420cac1f1';
    this.saltIVKey = '5cc34da0-8bbe-4b8c-8a55-abb420cac1f1';
  }

  async encryption(jsonToString, saltKey, aesEncRequestKey) {
    this.aesKey = aesEncRequestKey;
    this.saltIVKey = saltKey;
    return this.encryptJsonData(jsonToString);
  }

  async decryption(encryptedResponseData, saltKey, aesEncRequestKey) {
    this.aesKey = aesEncRequestKey;
    this.saltIVKey = saltKey;
    return this.decryptResponseData(encryptedResponseData);
  }

  async encryptJsonData(jsonToString) {
    const saltBytes = new TextEncoder().encode(this.saltIVKey);
    const passwordBytes = new TextEncoder().encode(this.aesKey);
    const key = await this.pbkdf2(passwordBytes, saltBytes, 65536, 256, 'SHA-1');
    const iv = this.ivBytes;
    const textBytes = new TextEncoder().encode(jsonToString);
    const cipher = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, textBytes);
    const encryptedTextBytes = new Uint8Array(cipher);
    return this.byteToHex(encryptedTextBytes);
  }

  async decryptResponseData(encryptedResponseData) {
    const saltBytes = new TextEncoder().encode(this.saltIVKey);
    const passwordBytes = new TextEncoder().encode(this.aesKey);
    const key = await this.pbkdf2(passwordBytes, saltBytes, 65536, 256, 'SHA-1');
    const iv = this.ivBytes;
    const encryptedTextBytes = this.hexToBytes(encryptedResponseData);
    const plain = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encryptedTextBytes);
    const decryptedTextBytes = new Uint8Array(plain);
    return new TextDecoder().decode(decryptedTextBytes);
  }

  async pbkdf2(passwordBytes, saltBytes, iterations, keyLength, hashAlgorithm) {
    const key = await crypto.subtle.importKey('raw', passwordBytes, { name: 'PBKDF2' }, false, ['deriveBits']);
    const params = { name: 'PBKDF2', salt: saltBytes, iterations, hash: hashAlgorithm };
    const derivedBits = await crypto.subtle.deriveBits(params, key, keyLength);
    return crypto.subtle.importKey('raw', derivedBits, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
  }

  byteToHex(byData) {
    const hexChars = [];
    for (let i = 0; i < byData.length; ++i) {
      const hex = (byData[i] & 0xff).toString(16);
      hexChars.push(hex.length === 1 ? '0' + hex : hex);
    }
    return hexChars.join('').toUpperCase();
  }

  hexToBytes(hexString) {
    const rawData = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < rawData.length; ++i) {
      const index = i * 2;
      const byte = parseInt(hexString.substring(index, index + 2), 16);
      rawData[i] = byte;
    }
    return rawData;
  }

}