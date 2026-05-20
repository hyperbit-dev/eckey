import * as secp256k1 from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha2.js';
import { createHash } from 'node:crypto';
import type { IECKey, KeyInput } from './types';

// Compat layer for @noble/secp256k1 v2 vs v3
const secpUtils = secp256k1.utils as Record<string, unknown>;
const isValidSecretKey = typeof secpUtils.isValidSecretKey === 'function'
  ? (k: Uint8Array) => (secp256k1.utils.isValidSecretKey as (k: Uint8Array) => boolean)(k)
  : (k: Uint8Array) => (secpUtils.isValidPrivateKey as (k: Uint8Array) => boolean)(k);

/**
 * Elliptic Curve Key - manages private/public keys for crypto operations
 * Uses @noble/secp256k1 for pure JS implementation
 * Used with cryptocurrencies like Bitcoin, Litecoin, Dogecoin, etc.
 */
export class ECKey implements IECKey {
  private key: Uint8Array | null = null;
  private _compressed: boolean = true;
  private _exportKey: Uint8Array | null = null;
  private _publicKey: Uint8Array | null = null;
  private _pubKeyHash: Uint8Array | null = null;
  private _publicHash: Uint8Array | null = null;

  /**
   * Creates a new ECKey instance
   * @param bytes - Initial private key bytes (Buffer, Uint8Array, or Array)
   * @param compressed - Whether public key should be compressed (default: true)
   */
  constructor(bytes?: KeyInput, compressed: boolean = true) {
    this._compressed = compressed;
    if (bytes) {
      this.privateKey = bytes;
    }
  }

  /**
   * Gets/sets the private key
   * Returns Buffer for compatibility with .toString('hex')
   */
  get privateKey(): Buffer {
    if (!this.key) {
      throw new Error('Private key not set');
    }
    return Buffer.from(this.key);
  }

  set privateKey(bytes: KeyInput) {
    let byteArr: number[];

    if (bytes instanceof Uint8Array) {
      byteArr = Array.from(bytes);
    } else if (Array.isArray(bytes)) {
      byteArr = bytes;
    } else {
      throw new Error(
        'Invalid type. private key bytes must be either a Buffer, Array, or Uint8Array.'
      );
    }

    if (byteArr.length !== 32) {
      throw new Error('private key bytes must have a length of 32');
    }

    const keyBytes = Uint8Array.from(byteArr);

    if (!isValidSecretKey(keyBytes)) {
      throw new Error('Invalid private key');
    }

    this.key = keyBytes;

    // _exportKey => privateKey + (0x01 if compressed)
    if (this._compressed) {
      this._exportKey = new Uint8Array([...keyBytes, 0x01]);
    } else {
      this._exportKey = keyBytes;
    }

    // Reset cached public key values
    this._publicKey = null;
    this._pubKeyHash = null;
    this._publicHash = null;
  }

  /**
   * Gets the private key export format (with compression flag if compressed)
   * Returns Buffer for compatibility with .toString('hex')
   */
  get privateExportKey(): Buffer {
    if (!this._exportKey) {
      throw new Error('Private key not initialized');
    }
    return Buffer.from(this._exportKey);
  }

  /**
   * Gets the public key (33 or 65 bytes depending on compression)
   * Returns Buffer for compatibility with .toString('hex')
   */
  get publicKey(): Buffer {
    if (!this._publicKey) {
      this._publicKey = secp256k1.getPublicKey(this.key!, this._compressed);
    }
    return Buffer.from(this._publicKey);
  }

  /**
   * Gets the public key hash (RIPEMD160(SHA256(publicKey)))
   * Returns Buffer for compatibility with .toString('hex')
   */
  get pubKeyHash(): Buffer {
    if (!this._pubKeyHash) {
      const sha = sha256(this.publicKey);
      this._pubKeyHash = createHash('ripemd160').update(Buffer.from(sha)).digest();
    }
    return Buffer.from(this._pubKeyHash);
  }

  /**
   * Alias for pubKeyHash
   * Returns Buffer for compatibility with .toString('hex')
   */
  get publicHash(): Buffer {
    if (!this._publicHash) {
      const sha = sha256(this.publicKey);
      this._publicHash = createHash('ripemd160').update(Buffer.from(sha)).digest();
    }
    return Buffer.from(this._publicHash);
  }

  /**
   * Gets/sets the compression state of the public key
   */
  get compressed(): boolean {
    return this._compressed;
  }

  set compressed(val: boolean) {
    const c = !!val;
    if (c === this._compressed) {
      return;
    }

    // Reset key stuff
    const pk = this.privateKey;
    this._compressed = c;
    this.privateKey = pk;
  }

  /**
   * Returns the private key as hex string
   */
  toString(_format?: string): string {
    return Buffer.from(this.privateKey).toString('hex');
  }

  /**
   * Signs a message hash with the private key
   * @param hash - 32-byte message hash to sign
   * @returns Compact signature (64 bytes)
   */
  sign(hash: Uint8Array): Uint8Array {
    if (!this.key) {
      throw new Error('Cannot sign without private key');
    }
    const signature = secp256k1.sign(hash, this.key);
    return (signature as unknown as { toCompactRawBytes(): Uint8Array }).toCompactRawBytes();
  }

  /**
   * Verifies a signature against a message hash
   * @param hash - 32-byte message hash
   * @param signature - Signature to verify (64 bytes)
   * @returns True if signature is valid
   */
  verify(hash: Uint8Array, signature: Uint8Array): boolean {
    try {
      return secp256k1.verify(signature, hash, this.publicKey);
    } catch {
      return false;
    }
  }
}

export default ECKey;
