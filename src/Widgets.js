class Widgets {
  constructor() {
    this.widgets = new Map();
  }

  _createKey(type, identifier = undefined) {
    return identifier ? `${type}:${identifier}` : type;
  }

  add(Widget, type, identifier = undefined) {
    const key = this._createKey(type, identifier);
    this.widgets.set(key, Widget);
  }

  get(type, identifier = undefined) {
    const key = this._createKey(type, identifier);
    return this.widgets.get(key) || null;
  }

  has(type, identifier = undefined) {
    const key = this._createKey(type, identifier);
    return this.widgets.has(key);
  }

  remove(type, identifier = undefined) {
    const key = this._createKey(type, identifier);
    this.widgets.delete(key);
  }

  // Custom iterator to handle entries
  [Symbol.iterator]() {
    const iterator = this.widgets.entries();
    return {
      next() {
        const { done, value } = iterator.next();
        if (done) {
          return { done };
        }
        const [key, widget] = value;
        const [type, identifier] = key.includes(":")
          ? key.split(":")
          : [key, undefined];
        return {
          value: [type, identifier, widget],
          done: false,
        };
      },
    };
  }
}
