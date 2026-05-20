import { Buffer } from 'node:buffer';
export type KeyInput = Buffer | Uint8Array | Array<number>;
export interface IECKey {
    /**
     * Gets/sets the private key
     */
    privateKey: Buffer;
    /**
     * Gets the private key export format (with compression flag if compressed)
     */
    privateExportKey: Buffer;
    /**
     * Gets the public key (33 or 65 bytes depending on compression)
     */
    publicKey: Buffer;
    /**
     * Gets the public key hash (RIPEMD160(SHA256(publicKey)))
     */
    pubKeyHash: Buffer;
    /**
     * Alias for pubKeyHash
     */
    publicHash: Buffer;
    /**
     * Gets/sets the compression state of the public key
     */
    compressed: boolean;
    /**
     * Returns the private key as hex string
     */
    toString(format?: string): string;
}
//# sourceMappingURL=types.d.ts.map