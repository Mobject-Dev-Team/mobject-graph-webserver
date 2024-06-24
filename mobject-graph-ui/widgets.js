export class Widgets {
  static WILDCARD = "*";
  static DISPLAY = "display";
  static CONTROL = "control";

  constructor() {
    this.widgets = new Map();
  }

  _createKey(type, capability, identifier = undefined) {
    return `${type}:${capability}${identifier ? `:${identifier}` : ""}`;
  }

  add(widgetClass, type, identifier = undefined) {
    const capability = widgetClass.capability;
    const key = this._createKey(type, capability, identifier);
    if (!this.widgets.has(key)) {
      this.widgets.set(key, new Set()); // Use Set to automatically handle unique insertion
    }
    this.widgets.get(key).add(widgetClass);
  }

  _getWidgetsByKey(key) {
    return Array.from(this.widgets.get(key) || []);
  }

  get(type, capability, identifier = undefined) {
    const specificKey = this._createKey(type, capability, identifier);
    const wildcardKey = this._createKey(type, capability, Widgets.WILDCARD);
    const specificWidgets = this._getWidgetsByKey(specificKey);
    const wildcardWidgets = this._getWidgetsByKey(wildcardKey);
    return Array.from(new Set([...specificWidgets, ...wildcardWidgets]));
  }

  getDisplaysOfType(type, identifier = undefined) {
    return this.get(type, Widgets.DISPLAY, identifier);
  }

  getControlsOfType(type, identifier = undefined) {
    return this.get(type, Widgets.CONTROL, identifier);
  }

  has(type, capability, identifier = undefined) {
    const specificKey = this._createKey(type, capability, identifier);
    const wildcardKey = this._createKey(type, capability, Widgets.WILDCARD);
    return this.widgets.has(specificKey) || this.widgets.has(wildcardKey);
  }

  hasDisplay(type, identifier) {
    const capability = Widgets.DISPLAY;
    return this.has(type, capability, identifier);
  }

  hasControl(type, identifier) {
    const capability = Widgets.CONTROL;
    return this.has(type, capability, identifier);
  }

  remove(type, capability, identifier = undefined) {
    const specificKey = this._createKey(type, capability, identifier);
    const wildcardKey = this._createKey(type, capability, Widgets.WILDCARD);
    this.widgets.delete(specificKey);
    this.widgets.delete(wildcardKey);
  }

  [Symbol.iterator]() {
    const iterator = this.widgets.entries();
    return {
      next: () => {
        const { done, value } = iterator.next();
        if (done) {
          return { done };
        }
        const [key, widgetSet] = value;
        const [type, capability, identifier] = key.split(":");
        return {
          value: [type, capability, identifier, Array.from(widgetSet)],
          done: false,
        };
      },
    };
  }
}
