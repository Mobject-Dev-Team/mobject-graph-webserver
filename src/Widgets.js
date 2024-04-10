class Widgets {
  constructor() {
    this.widgets = new Map();
  }

  _createKey(type, capability, identifier = undefined) {
    return `${type}:${capability}${identifier ? `:${identifier}` : ""}`;
  }

  add(Widget, type, identifier = undefined) {
    const capability = Widget.capability;
    const key = this._createKey(type, capability, identifier);
    if (!this.widgets.has(key)) {
      this.widgets.set(key, []);
    }
    this.widgets.get(key).push(Widget);
  }

  get(type, capability, identifier = undefined) {
    const specificKey = this._createKey(type, capability, identifier);
    const wildcardKey = this._createKey(type, capability, "*");
    const specificWidgets = this.widgets.get(specificKey) || [];
    const wildcardWidgets = this.widgets.get(wildcardKey) || [];
    return [...new Set([...specificWidgets, ...wildcardWidgets])]; // Merge and remove duplicates
  }

  getDisplaysOfType(type, identifier = undefined) {
    return this.get(type, "display", identifier);
  }

  getControlsOfType(type, identifier = undefined) {
    return this.get(type, "control", identifier);
  }

  has(type, capability, identifier = undefined) {
    const specificKey = this._createKey(type, capability, identifier);
    const wildcardKey = this._createKey(type, capability, "*");
    return this.widgets.has(specificKey) || this.widgets.has(wildcardKey);
  }

  remove(type, capability, identifier = undefined) {
    const specificKey = this._createKey(type, capability, identifier);
    const wildcardKey = this._createKey(type, capability, "*");
    if (this.widgets.has(specificKey)) {
      this.widgets.delete(specificKey);
    }
    if (this.widgets.has(wildcardKey)) {
      this.widgets.delete(wildcardKey);
    }
  }

  [Symbol.iterator]() {
    const iterator = this.widgets.entries();
    return {
      next() {
        const { done, value } = iterator.next();
        if (done) {
          return { done };
        }
        const [key, widgets] = value;
        const [type, capability, identifier] = key.split(":");
        return {
          value: [type, capability, identifier, widgets],
          done: false,
        };
      },
    };
  }
}
