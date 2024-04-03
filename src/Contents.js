class Contents {
  constructor() {
    this.contents = new Map();
  }

  addByName(name, content) {
    this.contents.set(name, content);
  }

  getByName(name) {
    return this.contents.get(name) || null;
  }

  contains(name) {
    return this.contents.has(name);
  }

  removeByName(name) {
    this.contents.delete(name);
  }

  [Symbol.iterator]() {
    return this.contents.entries();
  }
}
