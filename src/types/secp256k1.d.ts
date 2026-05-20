declare module 'secp256k1' {
  function publicKeyCreate(
    privateKey: Buffer | Uint8Array,
    compressed?: boolean
  ): Buffer;
  function publicKeyVerify(publicKey: Buffer | Uint8Array): boolean;
  function privateKeyVerify(privateKey: Buffer | Uint8Array): boolean;
  function sign(
    message: Buffer | Uint8Array,
    privateKey: Buffer | Uint8Array
  ): { signature: Buffer; recid: number };
  function signatureImport(signature: Buffer | Uint8Array): Buffer;
  function signatureExport(signature: Buffer | Uint8Array): Buffer;
  function verify(
    message: Buffer | Uint8Array,
    signature: Buffer | Uint8Array,
    publicKey: Buffer | Uint8Array
  ): boolean;
  function recover(
    message: Buffer | Uint8Array,
    signature: Buffer | Uint8Array,
    recovery: number,
    compressed?: boolean
  ): Buffer;

  export {
    publicKeyCreate,
    publicKeyVerify,
    privateKeyVerify,
    sign,
    signatureImport,
    signatureExport,
    verify,
    recover,
  };
}
