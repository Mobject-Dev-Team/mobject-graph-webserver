class Content {
  #name = null;
  #widget = null;
  #parent = null;

  constructor(name, widget) {
    this.#name = name;
    this.#widget = widget;
  }

  update(data) {
    console.log("Content", this.#name, "received data:", data);

    if (this.#widget) {
      this.#widget.update(data);
    }
  }

  registerWithParent(parent) {
    this.#parent = parent;
  }
}
