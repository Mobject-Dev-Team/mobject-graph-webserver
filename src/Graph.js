class Graph extends LGraph {
  #uuid = null;
  #eventEmitter = new EventEmitter();

  constructor(o) {
    super(o);
    this.#uuid = this.#generateUuid();
  }

  on(eventName, listener) {
    this.#eventEmitter.on(eventName, listener);
  }

  off(eventName, listener) {
    this.#eventEmitter.off(eventName, listener);
  }

  get uuid() {
    return this.#uuid;
  }

  update(status) {
    if (status && Array.isArray(status.nodes)) {
      status.nodes.forEach((status) => {
        const node = this.getNodeById(status.id);
        if (node) {
          node.update(status);
        }
      });
    }
  }

  #generateUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  onSerialize(data) {
    data.uuid = this.#uuid;
    return data;
  }

  #updateUuid() {
    this.#uuid = this.#generateUuid();
  }

  #notifyChange(event, ...args) {
    this.#eventEmitter.emit(event, ...args);
    this.#eventEmitter.emit("configurationChanged");
  }

  onConfigure(data) {
    this.#updateUuid();
    this.#notifyChange("graphConfigure");
  }

  onNodeAdded(node) {
    this.#updateUuid();
    this.#notifyChange("nodeAdded", node);
  }

  onNodeRemoved(node) {
    this.#updateUuid();
    this.#notifyChange("nodeRemoved", node);
  }

  onConnectionChange(node, link_info) {
    this.#updateUuid();
    this.#notifyChange("connectionChange", node, link_info);
  }

  onNodePropertyChanged(node, name, value, prev_value) {
    this.#notifyChange("propertyChange", node, name, value, prev_value);
  }

  /* this method was overridden as we needed to support our own GraphCanvas.
   * If we can remove our GraphCanvas Class then we can remove this override.
   */
  attachCanvas(graphcanvas) {
    // this is the line that was changed, it now states != GraphCanvas
    if (graphcanvas.constructor != GraphCanvas) {
      throw "attachCanvas expects a LGraphCanvas instance";
    }
    if (graphcanvas.graph && graphcanvas.graph != this) {
      graphcanvas.graph.detachCanvas(graphcanvas);
    }

    graphcanvas.graph = this;

    if (!this.list_of_graphcanvas) {
      this.list_of_graphcanvas = [];
    }
    this.list_of_graphcanvas.push(graphcanvas);
  }
}
