class Graph extends LGraph {
  #uuid = null;

  constructor(o) {
    super(o);
    this.#uuid = this.#generateUuid();
  }

  update(graphStatus) {
    graphStatus.nodes.forEach((nodeStatus) => {
      const node = this.getNodeById(nodeStatus.id);
      if (node) {
        node.update(nodeStatus);
      }
    });
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

  configurationHasChanged() {
    this.#uuid = this.#generateUuid();
    if (this.onConfigurationHasChanged) {
      this.onConfigurationHasChanged();
    }
  }

  onConfigure(data) {
    this.configurationHasChanged();
  }

  onSerialize(data) {
    data.uuid = this.#uuid;
    return data;
  }

  onNodeAdded(node) {
    this.configurationHasChanged();
  }

  onNodeRemoved(node) {
    this.configurationHasChanged();
  }

  connectionChange(node, link_info) {
    this.configurationHasChanged();
  }
}
