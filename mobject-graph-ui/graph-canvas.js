import { LGraphCanvas } from "/litegraph/src/lgraphcanvas.js";
import { LiteGraph } from "/litegraph/src/litegraph.js";

export class GraphCanvas extends LGraphCanvas {
  constructor(canvas, graph, options) {
    super(canvas, graph, options);
  }

  /* this method was overridden as there is a bug which prevents a widget
   * from receiving the mouse up event if the widget is no longer under the
   * mouse pointer.  This was fixed by passing the widget back in. This should
   * be reported back to litegraph, this way the GraphCanvas class would no
   * longer be needed.
   */
  // processMouseUp(e) {
  //   var is_primary = e.isPrimary === undefined || e.isPrimary;

  //   if (!is_primary) {
  //     return false;
  //   }

  //   if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;

  //   if (!this.graph) return;

  //   var window = this.getCanvasWindow();
  //   var document = window.document;
  //   LGraphCanvas.active_canvas = this;

  //   if (!this.options.skip_events) {
  //     LiteGraph.pointerListenerRemove(
  //       document,
  //       "move",
  //       this._mousemove_callback,
  //       true
  //     );
  //     LiteGraph.pointerListenerAdd(
  //       this.canvas,
  //       "move",
  //       this._mousemove_callback,
  //       true
  //     );
  //     LiteGraph.pointerListenerRemove(
  //       document,
  //       "up",
  //       this._mouseup_callback,
  //       true
  //     );
  //   }

  //   this.adjustMouseEvent(e);
  //   var now = LiteGraph.getTime();
  //   e.click_time = now - this.last_mouseclick;
  //   this.last_mouse_dragging = false;
  //   this.last_click_position = null;

  //   if (this.block_click) {
  //     this.block_click = false;
  //   }

  //   if (e.which == 1) {
  //     if (this.node_widget) {
  //       this.processNodeWidgets(
  //         this.node_widget[0],
  //         this.graph_mouse,
  //         e,
  //         // added this this.node_widget[1] here to allow the widget to receive the mouse up
  //         // event even if the widget is not under the mouse pointer.
  //         this.node_widget[1]
  //       );
  //     }

  //     this.node_widget = null;

  //     if (this.selected_group) {
  //       var diffx =
  //         this.selected_group.pos[0] - Math.round(this.selected_group.pos[0]);
  //       var diffy =
  //         this.selected_group.pos[1] - Math.round(this.selected_group.pos[1]);
  //       this.selected_group.move(diffx, diffy, e.ctrlKey);
  //       this.selected_group.pos[0] = Math.round(this.selected_group.pos[0]);
  //       this.selected_group.pos[1] = Math.round(this.selected_group.pos[1]);
  //       if (this.selected_group._nodes.length) {
  //         this.dirty_canvas = true;
  //       }
  //       this.selected_group = null;
  //     }
  //     this.selected_group_resizing = false;

  //     var node = this.graph.getNodeOnPos(
  //       e.canvasX,
  //       e.canvasY,
  //       this.visible_nodes
  //     );

  //     if (this.dragging_rectangle) {
  //       if (this.graph) {
  //         var nodes = this.graph._nodes;
  //         var node_bounding = new Float32Array(4);
  //         var w = Math.abs(this.dragging_rectangle[2]);
  //         var h = Math.abs(this.dragging_rectangle[3]);
  //         var startx =
  //           this.dragging_rectangle[2] < 0
  //             ? this.dragging_rectangle[0] - w
  //             : this.dragging_rectangle[0];
  //         var starty =
  //           this.dragging_rectangle[3] < 0
  //             ? this.dragging_rectangle[1] - h
  //             : this.dragging_rectangle[1];
  //         this.dragging_rectangle[0] = startx;
  //         this.dragging_rectangle[1] = starty;
  //         this.dragging_rectangle[2] = w;
  //         this.dragging_rectangle[3] = h;

  //         if (!node || (w > 10 && h > 10)) {
  //           var to_select = [];
  //           for (var i = 0; i < nodes.length; ++i) {
  //             var nodeX = nodes[i];
  //             nodeX.getBounding(node_bounding);
  //             if (
  //               !LiteGraph.overlapBounding(
  //                 this.dragging_rectangle,
  //                 node_bounding
  //               )
  //             ) {
  //               continue;
  //             }
  //             to_select.push(nodeX);
  //           }
  //           if (to_select.length) {
  //             this.selectNodes(to_select, e.shiftKey);
  //           }
  //         } else {
  //           this.selectNodes([node], e.shiftKey || e.ctrlKey);
  //         }
  //       }
  //       this.dragging_rectangle = null;
  //     } else if (this.connecting_node) {
  //       this.dirty_canvas = true;
  //       this.dirty_bgcanvas = true;

  //       var connInOrOut = this.connecting_output || this.connecting_input;
  //       var connType = connInOrOut.type;
  //       if (node) {
  //         if (this.connecting_output) {
  //           var slot = this.isOverNodeInput(node, e.canvasX, e.canvasY);
  //           if (slot != -1) {
  //             this.connecting_node.connect(this.connecting_slot, node, slot);
  //           } else {
  //             this.connecting_node.connectByType(
  //               this.connecting_slot,
  //               node,
  //               connType
  //             );
  //           }
  //         } else if (this.connecting_input) {
  //           var slot = this.isOverNodeOutput(node, e.canvasX, e.canvasY);

  //           if (slot != -1) {
  //             node.connect(slot, this.connecting_node, this.connecting_slot);
  //           } else {
  //             this.connecting_node.connectByTypeOutput(
  //               this.connecting_slot,
  //               node,
  //               connType
  //             );
  //           }
  //         }
  //       } else {
  //         if (LiteGraph.release_link_on_empty_shows_menu) {
  //           if (e.shiftKey && this.allow_searchbox) {
  //             if (this.connecting_output) {
  //               this.showSearchBox(e, {
  //                 node_from: this.connecting_node,
  //                 slot_from: this.connecting_output,
  //                 type_filter_in: this.connecting_output.type,
  //               });
  //             } else if (this.connecting_input) {
  //               this.showSearchBox(e, {
  //                 node_to: this.connecting_node,
  //                 slot_from: this.connecting_input,
  //                 type_filter_out: this.connecting_input.type,
  //               });
  //             }
  //           } else {
  //             if (this.connecting_output) {
  //               this.showConnectionMenu({
  //                 nodeFrom: this.connecting_node,
  //                 slotFrom: this.connecting_output,
  //                 e: e,
  //               });
  //             } else if (this.connecting_input) {
  //               this.showConnectionMenu({
  //                 nodeTo: this.connecting_node,
  //                 slotTo: this.connecting_input,
  //                 e: e,
  //               });
  //             }
  //           }
  //         }
  //       }

  //       this.connecting_output = null;
  //       this.connecting_input = null;
  //       this.connecting_pos = null;
  //       this.connecting_node = null;
  //       this.connecting_slot = -1;
  //     } else if (this.resizing_node) {
  //       this.dirty_canvas = true;
  //       this.dirty_bgcanvas = true;
  //       this.graph.afterChange(this.resizing_node);
  //       this.resizing_node = null;
  //     } else if (this.node_dragged) {
  //       var node = this.node_dragged;
  //       if (
  //         node &&
  //         e.click_time < 300 &&
  //         LiteGraph.isInsideRectangle(
  //           e.canvasX,
  //           e.canvasY,
  //           node.pos[0],
  //           node.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
  //           LiteGraph.NODE_TITLE_HEIGHT,
  //           LiteGraph.NODE_TITLE_HEIGHT
  //         )
  //       ) {
  //         node.collapse();
  //       }

  //       this.dirty_canvas = true;
  //       this.dirty_bgcanvas = true;
  //       this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]);
  //       this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]);
  //       if (this.graph.config.align_to_grid || this.align_to_grid) {
  //         this.node_dragged.alignToGrid();
  //       }
  //       if (this.onNodeMoved) this.onNodeMoved(this.node_dragged);
  //       this.graph.afterChange(this.node_dragged);
  //       this.node_dragged = null;
  //     } else {
  //       var node = this.graph.getNodeOnPos(
  //         e.canvasX,
  //         e.canvasY,
  //         this.visible_nodes
  //       );

  //       if (!node && e.click_time < 300) {
  //         this.deselectAllNodes();
  //       }

  //       this.dirty_canvas = true;
  //       this.dragging_canvas = false;

  //       if (this.node_over && this.node_over.onMouseUp) {
  //         this.node_over.onMouseUp(
  //           e,
  //           [
  //             e.canvasX - this.node_over.pos[0],
  //             e.canvasY - this.node_over.pos[1],
  //           ],
  //           this
  //         );
  //       }
  //       if (this.node_capturing_input && this.node_capturing_input.onMouseUp) {
  //         this.node_capturing_input.onMouseUp(e, [
  //           e.canvasX - this.node_capturing_input.pos[0],
  //           e.canvasY - this.node_capturing_input.pos[1],
  //         ]);
  //       }
  //     }
  //   } else if (e.which == 2) {
  //     this.dirty_canvas = true;
  //     this.dragging_canvas = false;
  //   } else if (e.which == 3) {
  //     this.dirty_canvas = true;
  //     this.dragging_canvas = false;
  //   }

  //   if (is_primary) {
  //     this.pointer_is_down = false;
  //     this.pointer_is_double = false;
  //   }

  //   this.graph.change();

  //   e.stopPropagation();
  //   e.preventDefault();
  //   return false;
  // }
}
