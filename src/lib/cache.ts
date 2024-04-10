export class Cache {
  private inMemoryDb: Map<
    string,
    {
      value: any;
    }
  >;
  private static instance: Cache;

  private constructor() {
    this.inMemoryDb = new Map<
      string,
      {
        value: any;
      }
    >();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Cache();
    }

    return this.instance;
  }

  set(type: string, args: string[], value: any) {
    this.inMemoryDb.set(`${type} ${JSON.stringify(args)}`, {
      value,
    });
  }

  get(type: string, args: string[]) {
    const key = `${type} ${JSON.stringify(args)}`;
    const entry = this.inMemoryDb.get(key);
    if (!entry) {
      return null;
    }
    return entry.value;
  }

  evict(type: string, args: string[]) {
    const key = `${type} ${JSON.stringify(args)}`;
    this.inMemoryDb.delete(key);
    return null;
  }
}
