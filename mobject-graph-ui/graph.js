import { LGraph } from "/litegraph/src/lgraph.js";
import { LiteGraph } from "/litegraph/src/litegraph.js";

export class Graph extends LGraph {
  #uuid = null;

  constructor(o) {
    super(o);
    this.#uuid = LiteGraph.uuidv4();
    this.registerCallbackHandler("onSerialize", (oCbInfo, data) => {
      data.uuid = this.#uuid;
    });
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

  beforeChange() {
    // before a graph change
  }
  afterChange() {
    // after a graph change
  }
}
