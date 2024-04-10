class Node extends LGraphNode {
  #eventEmitter = new EventEmitter();

  constructor(title) {
    super(title);
    this._shape = 2;
  }

  addCustomWidget(widget) {
    super.addCustomWidget(widget);
    this.setSize(this.computeSize());
    if (widget.registerWithParent) {
      widget.registerWithParent(this);
    }
  }

  on(eventName, listener) {
    this.#eventEmitter.on(eventName, listener);
  }

  off(eventName, listener) {
    this.#eventEmitter.off(eventName, listener);
  }

  update(status) {
    this.#eventEmitter.emit("nodeUpdated", status);
  }

  onPropertyChanged(name, value, prev_value) {
    const graph = this.graph;
    if (graph && !graph.block_configure_events) {
      graph.onNodePropertyChanged(this, name, value, prev_value);
    }
  }
}
