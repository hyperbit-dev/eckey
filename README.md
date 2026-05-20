# @hyperbitjs/eckey

[![npm version](https://img.shields.io/npm/v/@hyperbitjs/eckey.svg?style=flat-square)](https://www.npmjs.org/package/@hyperbitjs/eckey)
[![npm downloads](https://img.shields.io/npm/dm/@hyperbitjs/eckey.svg?style=flat-square)](https://www.npmjs.org/package/@hyperbitjs/eckey)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![CI/CD](https://github.com/hyperbit-dev/eckey/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/hyperbit-dev/eckey/actions)

Elliptic Curve cryptography library for managing private/public keys in Node.js and the browser. Used with cryptocurrencies such as Bitcoin, Litecoin, Dogecoin, and many others.

## Features

- **Dual module support**: Works with both CommonJS (`.cjs`) and ES modules (`.mjs`)
- **Full TypeScript support**: Includes complete type definitions
- **Key management**: Create, import, and manage EC keys
- **Cryptographic operations**: Sign messages with private keys and verify signatures
- **Hash operations**: SHA256 and RIPEMD160 hashing support
- **Compression**: Support for compressed and uncompressed public keys
- **Cross-platform**: Node.js and browser compatible

## Installation

```bash
npm install @hyperbitjs/eckey
```

## Quick Start

```typescript
import { ECKey } from '@hyperbitjs/eckey';

// Create a new key pair
const key = new ECKey();

// Access the keys
const privateKey = key.privateKey; // Buffer
const publicKey = key.publicKey; // Buffer (compressed by default)
const publicKeyHash = key.pubKeyHash; // Buffer - RIPEMD160(SHA256(publicKey))

// Import from existing private key
const importedKey = new ECKey(privateKeyBuffer, compressed);

// Sign a message
const signature = key.sign(message);

// Verify a signature
const isValid = key.verify(message, signature);
```

## API Reference

### `ECKey` Class

#### Constructor

```typescript
constructor(bytes?: KeyInput, compressed?: boolean)
```

- `bytes?: KeyInput` - Private key bytes (Buffer, Uint8Array, or Array<number>). Optional.
- `compressed?: boolean` - Whether public key should be compressed (default: `true`)

#### Properties

- **`privateKey: Buffer`** - Get/set the private key (32 bytes)
- **`privateExportKey: Buffer`** - Get the private key in export format
- **`publicKey: Buffer`** - Get the public key (33 or 65 bytes depending on compression)
- **`pubKeyHash: Buffer`** - Get the public key hash (20 bytes)
- **`publicHash: Buffer`** - Alias for `pubKeyHash`

#### Methods

- **`sign(message: Buffer): Buffer`** - Sign a message with the private key
- **`verify(message: Buffer, signature: Buffer): boolean`** - Verify a message signature
- **`getPublicKey(compressed?: boolean): Buffer`** - Get the public key in specified format

## Usage Examples

### Basic Key Generation

```typescript
import { ECKey } from '@hyperbitjs/eckey';

// Create a random key
const key = new ECKey();
console.log(key.publicKey); // 33-byte compressed public key
console.log(key.pubKeyHash); // 20-byte hash
```

### Working with Existing Keys

```typescript
// Import from WIF (Wallet Import Format) or hex
const hexPrivateKey = Buffer.from('1234567890abcdef...', 'hex');
const key = new ECKey(hexPrivateKey, true); // true for compression

// Export formats
console.log(key.privateKey); // Raw 32-byte private key
console.log(key.privateExportKey); // Private key + compression flag
```

### Message Signing

```typescript
import { createHash } from 'crypto';

const key = new ECKey();
const message = Buffer.from('Hello, Bitcoin!');

// In real applications, use proper message hashing
const messageHash = createHash('sha256').update(message).digest();

const signature = key.sign(messageHash);
const isValid = key.verify(messageHash, signature);

console.log('Signature valid:', isValid);
```

## Type Definitions

Full TypeScript interfaces are provided:

```typescript
export type KeyInput = Buffer | Uint8Array | Array<number>;

export interface IECKey {
  privateKey: Buffer;
  privateExportKey: Buffer;
  publicKey: Buffer;
  pubKeyHash: Buffer;
  publicHash: Buffer;
  sign(message: Buffer): Buffer;
  verify(message: Buffer, signature: Buffer): boolean;
  getPublicKey(compressed?: boolean): Buffer;
}
```

## Browser Compatibility

This library works in modern browsers with ES module support. Use a bundler like Webpack, Vite, or Rollup for production builds.

```html
<script type="module">
  import { ECKey } from 'https://cdn.jsdelivr.net/npm/@hyperbitjs/eckey/dist/index.mjs';

  const key = new ECKey();
  console.log(key.publicKey);
</script>
```

## Security Notes

- **Private key handling**: Always keep private keys secure and never share them
- **Message hashing**: Always properly hash messages before signing
- **Key storage**: Consider using encrypted storage for sensitive applications
- **Entropy**: This library uses Node.js's built-in crypto for key generation

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING](CONTRIBUTING.md) guide first.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Format code
npm run format
```

## License

MIT © [Hyperbit](https://github.com/hyperbit-dev)

## Related Projects

- [@hyperbitjs/hdkey](https://github.com/hyperbit-dev/hdkey) - BIP32 HD key derivation
- [@hyperbitjs/chains](https://github.com/hyperbit-dev/chains) - Blockchain network definitions
- [@hyperbitjs/mnemonic](https://github.com/hyperbit-dev/mnemonic) - BIP39 mnemonic support

## Support

For issues, questions, or suggestions:

- Open an issue on [GitHub](https://github.com/hyperbit-dev/eckey/issues)
- Check existing documentation and examples
- Review our [CHANGELOG](CHANGELOG.md) for version history

## Overview
This project lives at `eckey` and is part of the broader multi-project workspace.
**Description:** Handle private key and public keys associated with elliptic curve cryptography. Used with crypto currencies such as Bitcoin, Litecoin, Dogecoin, etc. Works in both Node.js and the browser.
## Purpose
- Deliver the core capability owned by this project.
- Provide stable commands and interfaces for other apps/packages in the workspace.
- Keep implementation details localized so changes stay maintainable.
## Architecture Notes
- Type: **Project**
- Package manager metadata source: `package.json`
- Runtime entry hints: `./dist/index.cjs`
## Setup
1. Install dependencies from this directory:
```bash
npm install
```
2. Run key scripts as needed (see script table below).
## NPM Scripts
| Script | Command |
|---|---|
| `build` | `vite build` |
| `build:watch` | `vite build --watch` |
| `dev` | `vite build --watch` |
| `type-check` | `tsc --noEmit` |
| `lint` | `eslint . --max-warnings 0` |
| `lint:fix` | `eslint . --fix` |
| `format` | `prettier --write .` |
| `format:check` | `prettier --check .` |
| `test` | `vitest --run` |
| `test:watch` | `vitest` |
| `test:coverage` | `vitest --coverage` |
| `validate` | `npm run type-check && npm run lint && npm run test` |
| `prepublishOnly` | `npm run build && npm run validate` |
## Dependencies
### Production
- `secp256k1`: `^5.0.1`
### Development
- `@types/node`: `^20.10.0`
- `@typescript-eslint/eslint-plugin`: `^6.21.0`
- `@typescript-eslint/parser`: `^6.21.0`
- `@vitest/coverage-v8`: `^1.1.0`
- `eslint`: `^8.56.0`
- `prettier`: `^3.0.3`
- `secure-random`: `^1.1.1`
- `typescript`: `^5.3.3`
- `vite`: `^5.0.11`
- `vitest`: `^1.1.3`
## Configuration
- Primary config source: `package.json`
- No `.env.example` detected in this directory.
- Add project-specific operational notes to `MEMORY_BANK.md`.
## Development Workflow
1. Make changes in focused modules.
2. Run the smallest relevant script/test first.
3. Run full validation scripts before merging.
4. Update this README and memory bank whenever behavior/contracts change.
## Testing and Validation
- Prefer script-driven checks from the table above (for example: `test`, `build`, `lint`).
- If this project has no tests yet, add smoke checks and document them in `MEMORY_BANK.md`.
## LLM Context
When using an LLM coding assistant in this folder, always include:
- Exact target file paths and expected behavior changes.
- Validation command(s) run after edits.
- Runtime/config assumptions (.env, API keys, ports, external services).

## Memory Bank
See `MEMORY_BANK.md` for operational context, commands, and troubleshooting notes.
