import * as secp256k1 from "@noble/secp256k1";
import { sha256 } from "@noble/hashes/sha2.js";
import { createHash } from "node:crypto";
//#region src/index.ts
var secpUtils = secp256k1.utils;
var isValidSecretKey = typeof secpUtils.isValidSecretKey === "function" ? (k) => secp256k1.utils.isValidSecretKey(k) : (k) => secpUtils.isValidPrivateKey(k);
/**
* Elliptic Curve Key - manages private/public keys for crypto operations
* Uses @noble/secp256k1 for pure JS implementation
* Used with cryptocurrencies like Bitcoin, Litecoin, Dogecoin, etc.
*/
var ECKey = class {
	/**
	* Creates a new ECKey instance
	* @param bytes - Initial private key bytes (Buffer, Uint8Array, or Array)
	* @param compressed - Whether public key should be compressed (default: true)
	*/
	constructor(bytes, compressed = true) {
		this.key = null;
		this._compressed = true;
		this._exportKey = null;
		this._publicKey = null;
		this._pubKeyHash = null;
		this._publicHash = null;
		this._compressed = compressed;
		if (bytes) this.privateKey = bytes;
	}
	/**
	* Gets/sets the private key
	* Returns Buffer for compatibility with .toString('hex')
	*/
	get privateKey() {
		if (!this.key) throw new Error("Private key not set");
		return Buffer.from(this.key);
	}
	set privateKey(bytes) {
		let byteArr;
		if (bytes instanceof Uint8Array) byteArr = Array.from(bytes);
		else if (Array.isArray(bytes)) byteArr = bytes;
		else throw new Error("Invalid type. private key bytes must be either a Buffer, Array, or Uint8Array.");
		if (byteArr.length !== 32) throw new Error("private key bytes must have a length of 32");
		const keyBytes = Uint8Array.from(byteArr);
		if (!isValidSecretKey(keyBytes)) throw new Error("Invalid private key");
		this.key = keyBytes;
		if (this._compressed) this._exportKey = new Uint8Array([...keyBytes, 1]);
		else this._exportKey = keyBytes;
		this._publicKey = null;
		this._pubKeyHash = null;
		this._publicHash = null;
	}
	/**
	* Gets the private key export format (with compression flag if compressed)
	* Returns Buffer for compatibility with .toString('hex')
	*/
	get privateExportKey() {
		if (!this._exportKey) throw new Error("Private key not initialized");
		return Buffer.from(this._exportKey);
	}
	/**
	* Gets the public key (33 or 65 bytes depending on compression)
	* Returns Buffer for compatibility with .toString('hex')
	*/
	get publicKey() {
		if (!this._publicKey) this._publicKey = secp256k1.getPublicKey(this.key, this._compressed);
		return Buffer.from(this._publicKey);
	}
	/**
	* Gets the public key hash (RIPEMD160(SHA256(publicKey)))
	* Returns Buffer for compatibility with .toString('hex')
	*/
	get pubKeyHash() {
		if (!this._pubKeyHash) {
			const sha = sha256(this.publicKey);
			this._pubKeyHash = createHash("ripemd160").update(Buffer.from(sha)).digest();
		}
		return Buffer.from(this._pubKeyHash);
	}
	/**
	* Alias for pubKeyHash
	* Returns Buffer for compatibility with .toString('hex')
	*/
	get publicHash() {
		if (!this._publicHash) {
			const sha = sha256(this.publicKey);
			this._publicHash = createHash("ripemd160").update(Buffer.from(sha)).digest();
		}
		return Buffer.from(this._publicHash);
	}
	/**
	* Gets/sets the compression state of the public key
	*/
	get compressed() {
		return this._compressed;
	}
	set compressed(val) {
		const c = !!val;
		if (c === this._compressed) return;
		const pk = this.privateKey;
		this._compressed = c;
		this.privateKey = pk;
	}
	/**
	* Returns the private key as hex string
	*/
	toString(_format) {
		return Buffer.from(this.privateKey).toString("hex");
	}
	/**
	* Signs a message hash with the private key
	* @param hash - 32-byte message hash to sign
	* @returns Compact signature (64 bytes)
	*/
	sign(hash) {
		if (!this.key) throw new Error("Cannot sign without private key");
		return secp256k1.sign(hash, this.key).toCompactRawBytes();
	}
	/**
	* Verifies a signature against a message hash
	* @param hash - 32-byte message hash
	* @param signature - Signature to verify (64 bytes)
	* @returns True if signature is valid
	*/
	verify(hash, signature) {
		try {
			return secp256k1.verify(signature, hash, this.publicKey);
		} catch {
			return false;
		}
	}
};
//#endregion
export { ECKey, ECKey as default };

//# sourceMappingURL=index.mjs.map