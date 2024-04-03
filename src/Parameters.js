class Parameters {
  constructor() {
    this.parameters = new Map();
  }

  addByName(name, value) {
    this.parameters.set(name, value);
  }

  getByName(name) {
    return this.parameters.has(name) ? this.parameters.get(name) : null;
  }

  contains(name) {
    return this.parameters.has(name);
  }

  removeByName(name) {
    this.parameters.delete(name);
  }

  [Symbol.iterator]() {
    return this.parameters.entries();
  }
}
