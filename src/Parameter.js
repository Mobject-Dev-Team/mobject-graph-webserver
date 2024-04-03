class Parameter {
  #name = null;
  #widget = null;
  #parent = null;

  constructor(name, widget) {
    this.#name = name;
    this.#widget = widget;
  }

  registerWithParent(parent) {
    this.#parent = parent;
  }
}
