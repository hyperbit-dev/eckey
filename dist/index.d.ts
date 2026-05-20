import { IECKey, KeyInput } from './types';
/**
 * Elliptic Curve Key - manages private/public keys for crypto operations
 * Uses @noble/secp256k1 for pure JS implementation
 * Used with cryptocurrencies like Bitcoin, Litecoin, Dogecoin, etc.
 */
export declare class ECKey implements IECKey {
    private key;
    private _compressed;
    private _exportKey;
    private _publicKey;
    private _pubKeyHash;
    private _publicHash;
    /**
     * Creates a new ECKey instance
     * @param bytes - Initial private key bytes (Buffer, Uint8Array, or Array)
     * @param compressed - Whether public key should be compressed (default: true)
     */
    constructor(bytes?: KeyInput, compressed?: boolean);
    /**
     * Gets/sets the private key
     * Returns Buffer for compatibility with .toString('hex')
     */
    get privateKey(): Buffer;
    set privateKey(bytes: KeyInput);
    /**
     * Gets the private key export format (with compression flag if compressed)
     * Returns Buffer for compatibility with .toString('hex')
     */
    get privateExportKey(): Buffer;
    /**
     * Gets the public key (33 or 65 bytes depending on compression)
     * Returns Buffer for compatibility with .toString('hex')
     */
    get publicKey(): Buffer;
    /**
     * Gets the public key hash (RIPEMD160(SHA256(publicKey)))
     * Returns Buffer for compatibility with .toString('hex')
     */
    get pubKeyHash(): Buffer;
    /**
     * Alias for pubKeyHash
     * Returns Buffer for compatibility with .toString('hex')
     */
    get publicHash(): Buffer;
    /**
     * Gets/sets the compression state of the public key
     */
    get compressed(): boolean;
    set compressed(val: boolean);
    /**
     * Returns the private key as hex string
     */
    toString(_format?: string): string;
    /**
     * Signs a message hash with the private key
     * @param hash - 32-byte message hash to sign
     * @returns Compact signature (64 bytes)
     */
    sign(hash: Uint8Array): Uint8Array;
    /**
     * Verifies a signature against a message hash
     * @param hash - 32-byte message hash
     * @param signature - Signature to verify (64 bytes)
     * @returns True if signature is valid
     */
    verify(hash: Uint8Array, signature: Uint8Array): boolean;
}
export default ECKey;
//# sourceMappingURL=index.d.ts.map