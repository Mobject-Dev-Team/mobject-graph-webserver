import { EventEmitter } from "./utils/EventEmitter.js";
import { LGraphNode } from "/litegraph/src/lgraphnode.js";
import { LiteGraph } from "/litegraph/src/litegraph.js";

export class Node extends LGraphNode {
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

  computeSize(out) {
    let size = super.computeSize(out);

    // the code below was added to correct long titles and
    // a bug which litegraph would not use a widget width
    // for the calculations

    let title_width = LiteGraph.computeTextWidth(this.title) + 40;
    let widgets_maximum_width = 0;

    if (this.widgets && this.widgets.length) {
      for (var i = 0, l = this.widgets.length; i < l; ++i) {
        let widget_size = this.widgets[i].computeSize();
        widgets_maximum_width = Math.max(widgets_maximum_width, widget_size[0]);
      }
    }

    size[0] = Math.max(size[0], title_width, widgets_maximum_width);

    if (this.onComputeSize) {
      var custom_size = this.onComputeSize(size);
      size[0] = Math.max(size[0], custom_size[0]);
      size[1] = Math.max(size[1], custom_size[1]);
    }

    return size;
  }
}
