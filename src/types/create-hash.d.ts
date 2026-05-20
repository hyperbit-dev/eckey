declare module 'create-hash' {
  interface Hash {
    update(data: string | Buffer, encoding?: string): Hash;
    digest(encoding?: string): Buffer | string;
  }

  function createHash(algorithm: string): Hash;

  namespace createHash {
    function createHash(algorithm: string): Hash;
  }

  export = createHash;
}
