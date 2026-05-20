import { describe, it, expect } from 'vitest';
import secureRandom from 'secure-random';
import ECKey from '../src/index';

describe('ECKey', () => {
  describe('+ ECKey()', () => {
    describe('> when input is a Buffer', () => {
      it('should create a new ECKey ', () => {
        const buf = secureRandom(32, { type: 'Buffer' });
        const key = new ECKey(buf);
        expect(key.privateKey.toString('hex')).toBe(buf.toString('hex'));
        expect(key.compressed).toBe(true);
      });
    });

    describe('> when new isnt used', () => {
      it('should create a new ECKey', () => {
        const bytes = secureRandom(32, { type: 'Buffer' });
        const buf = Buffer.from(bytes);
        /// Constructor without new still works due to the pattern in original code
        // Since we're using a class now, new is required in TypeScript
        let key = new ECKey(buf);
        expect(key.privateKey.toString('hex')).toBe(buf.toString('hex'));

        key = new ECKey(buf, true);
        expect(key.compressed).toBe(true);

        key = new ECKey(buf, false);
        expect(key.compressed).toBe(false);
      });
    });

    describe('> when input is a Uint8Array', () => {
      it('should create a new ECKey', () => {
        const bytes = secureRandom(32, { type: 'Uint8Array' });
        expect(bytes).toBeInstanceOf(Uint8Array);

        const key = new ECKey(bytes);
        expect(key.privateKey.toString('hex')).toBe(
          Buffer.from(bytes).toString('hex')
        );
        expect(key.compressed).toBe(true);
      });
    });

    describe('> when input is an Array', () => {
      it('should create a new ECKey', () => {
        const bytes = secureRandom(32, { type: 'Array' });
        expect(Array.isArray(bytes)).toBe(true);

        const key = new ECKey(bytes);
        expect(key.privateKey.toString('hex')).toBe(
          Buffer.from(bytes).toString('hex')
        );
        expect(key.compressed).toBe(true);
      });
    });

    describe('> when compressed is true', () => {
      it('should set compressed flag correctly on empty key', () => {
        const key = new ECKey(undefined, true);
        expect(key.compressed).toBe(true);
      });

      it('should set compressed flag correctly with initial key', () => {
        const key2 = new ECKey(secureRandom(32, { type: 'Buffer' }), true);
        expect(key2.compressed).toBe(true);
      });
    });

    describe('> when bad data type', () => {
      it('should throw an error', () => {
        const data = new Uint16Array(16);

        expect(() => {
          return new ECKey(data as any);
        }).toThrow(/invalid type/i);
      });
    });
  });

  describe('- compressed', () => {
    describe('> when false to true', () => {
      it('should change privateExportKey and all other affected fields', () => {
        const privateKey = Buffer.from(
          '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd',
          'hex'
        );
        const key = new ECKey(privateKey, false);
        expect(key.compressed).toBe(false);
        const pubKey = key.publicKey;
        expect(key.privateExportKey.toString('hex').slice(-2)).not.toEqual(
          '01'
        );

        key.compressed = true;

        expect(pubKey.toString('hex')).not.toEqual(
          key.publicKey.toString('hex')
        );
        expect(key.privateExportKey.toString('hex').slice(-2)).toEqual('01');
      });
    });

    describe('> when true to false', () => {
      it('should change privateExportKey and all other affected fields', () => {
        const privateKey = Buffer.from(
          '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd',
          'hex'
        );
        const key = new ECKey(privateKey, true);
        expect(key.compressed).toBe(true);
        const pubKey = key.publicKey;
        expect(key.privateExportKey.toString('hex').slice(-2)).toEqual('01');

        key.compressed = false;

        expect(pubKey.toString('hex')).not.toEqual(
          key.publicKey.toString('hex')
        );
        expect(key.privateExportKey.toString('hex').slice(-2)).not.toEqual(
          '01'
        );
      });
    });
  });

  describe('- privateKey', () => {
    it('should return the private key', () => {
      const privateKeyHex =
        '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
      const key = new ECKey(Array.from(Buffer.from(privateKeyHex, 'hex')));
      expect(key.privateKey.toString('hex')).toBe(privateKeyHex);
    });

    describe('> when length is not 32', () => {
      it('should throw an error', () => {
        const key = new ECKey(secureRandom(32, { type: 'Buffer' }));
        expect(() => {
          key.privateKey = Buffer.from('ff33', 'hex');
        }).toThrow(/length of 32/i);
      });
    });
  });

  describe('- privateExportKey', () => {
    describe('> when not compressed', () => {
      it('should return the private key', () => {
        const privateKeyHex =
          '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
        const key = new ECKey(Buffer.from(privateKeyHex, 'hex'), false);
        expect(key.privateExportKey.toString('hex')).toBe(privateKeyHex);
      });
    });

    describe('> when compressed', () => {
      it('should return the private key with 01 suffix', () => {
        const privateKeyHex =
          '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
        const key = new ECKey(Buffer.from(privateKeyHex, 'hex'), true);
        expect(key.compressed).toBe(true);
        expect(key.privateExportKey.toString('hex')).toBe(privateKeyHex + '01');
      });
    });
  });

  describe('- publicKey', () => {
    describe('> when not compressed', () => {
      it('should return the 65 byte public key', () => {
        const privateKeyHex =
          '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
        const publicKeyHex =
          '04d0988bfa799f7d7ef9ab3de97ef481cd0f75d2367ad456607647edde665d6f6fbdd594388756a7beaf73b4822bc22d36e9bda7db82df2b8b623673eefc0b7495';
        const key = new ECKey(
          Array.from(Buffer.from(privateKeyHex, 'hex')),
          false
        );
        expect(key.publicKey.length).toBe(65);
        expect(key.publicKey.toString('hex')).toBe(publicKeyHex);
      });
    });

    describe('> when compressed', () => {
      it('should return the 33 byte public key', () => {
        const privateKeyHex =
          '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
        const publicKeyHex =
          '03d0988bfa799f7d7ef9ab3de97ef481cd0f75d2367ad456607647edde665d6f6f';
        const key = new ECKey(
          Array.from(Buffer.from(privateKeyHex, 'hex')),
          true
        );

        expect(key.compressed).toBe(true);
        expect(key.publicKey.length).toBe(33);
        expect(key.publicKey.toString('hex')).toBe(publicKeyHex);
      });
    });
  });

  describe('- publicHash', () => {
    it('should return the hash 160 of public key', () => {
      const key = new ECKey(
        Buffer.from(
          '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd',
          'hex'
        ),
        false
      );
      expect(key.publicHash.toString('hex')).toBe(
        '3c176e659bea0f29a3e9bf7880c112b1b31b4dc8'
      );
      expect(key.pubKeyHash.toString('hex')).toBe(
        '3c176e659bea0f29a3e9bf7880c112b1b31b4dc8'
      );
      key.compressed = true;
      expect(key.publicHash.toString('hex')).toBe(
        'a1c2f92a9dacbd2991c3897724a93f338e44bdc1'
      );
      expect(key.pubKeyHash.toString('hex')).toBe(
        'a1c2f92a9dacbd2991c3897724a93f338e44bdc1'
      );
    });
  });

  describe('- toString()', () => {
    it('should show the string representation in hex', () => {
      const privateKeyBytes = Array.from(
        Buffer.from(
          '1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD',
          'hex'
        )
      );
      const eckey = new ECKey(privateKeyBytes);
      const s = eckey.toString();
      expect(s).toBe(
        '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd'
      );
    });
  });
});

describe('Error cases', () => {
  it('should throw when getting privateKey without initialization', () => {
    const key = new ECKey();
    expect(() => key.privateKey).toThrow(/Private key not set/);
  });

  it('should throw when getting privateExportKey without initialization', () => {
    const key = new ECKey();
    expect(() => key.privateExportKey).toThrow(/Private key not initialized/);
  });

  it('should throw error for invalid key type (object)', () => {
    expect(() => {
      new ECKey({} as any);
    }).toThrow(/invalid type/i);
  });

  it('should throw error for invalid key type (string)', () => {
    expect(() => {
      new ECKey(
        '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd' as any
      );
    }).toThrow(/invalid type/i);
  });

  it('should throw error for invalid key type (number)', () => {
    expect(() => {
      new ECKey(123 as any);
    }).toThrow(/invalid type/i);
  });
});

describe('Public key caching', () => {
  it('should cache and reuse public key for multiple calls', () => {
    const privateKeyHex =
      '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
    const key = new ECKey(Buffer.from(privateKeyHex, 'hex'), true);

    const pk1 = key.publicKey;
    const pk2 = key.publicKey;

    expect(pk1.toString('hex')).toBe(pk2.toString('hex'));
  });

  it('should invalidate publicKey cache when compression changes', () => {
    const privateKeyHex =
      '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
    const key = new ECKey(Buffer.from(privateKeyHex, 'hex'), true);

    const pk1 = key.publicKey;
    key.compressed = false;
    const pk2 = key.publicKey;

    expect(pk1.toString('hex')).not.toBe(pk2.toString('hex'));
    expect(pk1.length).toBe(33);
    expect(pk2.length).toBe(65);
  });
});

describe('Multiple private key assignments', () => {
  it('should update public key when private key is reassigned', () => {
    const key = new ECKey();
    const pk1Hex =
      '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
    const pk2Hex =
      'e8f32e723decf97feaf1a2f10d0ccc1988d89dee5f01d65fe2f68117f0c6228ac';

    key.privateKey = Buffer.from(pk1Hex, 'hex');
    const publicKey1 = key.publicKey.toString('hex');

    key.privateKey = Buffer.from(pk2Hex, 'hex');
    const publicKey2 = key.publicKey.toString('hex');

    expect(publicKey1).not.toBe(publicKey2);
  });

  it('should update hash when private key is reassigned', () => {
    const key = new ECKey();
    const pk1Hex =
      '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
    const pk2Hex =
      'e8f32e723decf97feaf1a2f10d0ccc1988d89dee5f01d65fe2f68117f0c6228ac';

    key.privateKey = Buffer.from(pk1Hex, 'hex');
    const hash1 = key.pubKeyHash.toString('hex');

    key.privateKey = Buffer.from(pk2Hex, 'hex');
    const hash2 = key.pubKeyHash.toString('hex');

    expect(hash1).not.toBe(hash2);
  });
});

describe('Compression state consistency', () => {
  it('should maintain compression state through operations', () => {
    const key = new ECKey(
      Buffer.from(
        '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd',
        'hex'
      ),
      true
    );

    expect(key.compressed).toBe(true);
    const pk = key.publicKey;
    expect(pk.length).toBe(33);
    expect(key.compressed).toBe(true);
  });

  it('should not change compression when toggled to same value', () => {
    const privateKeyHex =
      '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
    const key = new ECKey(Buffer.from(privateKeyHex, 'hex'), true);

    const pk1 = key.publicKey.toString('hex');
    key.compressed = true; // no-op
    const pk2 = key.publicKey.toString('hex');

    expect(pk1).toBe(pk2);
  });
});

describe('Buffer type conversions', () => {
  it('should handle mixed Buffer/Uint8Array/Array inputs correctly', () => {
    const hex =
      '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';

    const key1 = new ECKey(Buffer.from(hex, 'hex'));
    const key2 = new ECKey(new Uint8Array(Buffer.from(hex, 'hex')));
    const key3 = new ECKey(Array.from(Buffer.from(hex, 'hex')));

    expect(key1.privateKey.toString('hex')).toBe(
      key2.privateKey.toString('hex')
    );
    expect(key1.privateKey.toString('hex')).toBe(
      key3.privateKey.toString('hex')
    );
  });
});
