export const WILDCARD = "*";
export const DISPLAY = "display";
export const CONTROL = "control";

export class DisplayWidget {
  static capability = DISPLAY;

  #parent = null;
  #content = null;

  constructor(name, parent, options = {}) {
    this.options = options;
    this.name = name;

    this.#parent = parent;
    this.#content = options.content;

    this.registerForContentUpdates();
  }

  onContentUpdate(value) {}

  registerForContentUpdates() {
    if (!this.#content || !this.#parent) return;
    this.#parent.on("nodeStatusUpdated", (status) => {
      const value = status.contents?.find(
        (content) => content.name === this.#content.name
      )?.value;
      this.onContentUpdate(value);
      this.#parent?.setDirtyCanvas(true, true);
    });
  }

  triggerParentResetSize() {
    if (this.#parent) this.#parent.resetSize();
  }
}

export class ControlWidget {
  static capability = CONTROL;

  #parent = null;
  #property = null;
  #parameter = null;

  constructor(name, parent, options = {}) {
    this.value = null;
    this.options = options;
    this.name = name;

    this.#parent = parent;
    this.#property = options.property;
    this.#parameter = options.parameter;
  }

  setValue(value) {
    this.value = value;

    if (this.#parent && this.#property && this.#property.name) {
      this.#parent?.setProperty(this.#property.name, value);
      this.#parent?.setDirtyCanvas(true, true);
    }
  }

  getValue() {
    return this.value;
  }

  setDefaultValue(value) {
    this.value = value;

    if (this.#parent && this.#property && this.#property.name) {
      this.#parent?.setPropertyDefaultValue(this.#property.name, value);
      this.#parent?.setDirtyCanvas(true, true);
    }
  }

  triggerParentResetSize() {
    if (this.#parent) this.#parent.resetSize();
  }
}
