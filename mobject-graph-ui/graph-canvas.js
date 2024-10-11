import { LGraphCanvas } from "/litegraph/src/lgraphcanvas.js";
import { LiteGraph } from "/litegraph/src/litegraph.js";

// This function has been overidden to expand the functionality to add graceful fall over if the node
// has not yet been registered with litegraph (this can happen if you are still waiting for blueprints)

LGraphCanvas.prototype.checkDropItem = function (e) {
  if (e.dataTransfer.files.length) {
    var file = e.dataTransfer.files[0];
    var ext = LGraphCanvas.getFileExtension(file.name);
    var nodetype = LiteGraph.node_types_by_file_extension[ext];
    if (nodetype) {
      this.graph.beforeChange();
      var node = LiteGraph.createNode(nodetype.type);
      if (!node) {
        console.log(nodetype.type, "is not available to handle", ext);
        return;
      }
      node.pos = [e.canvasX, e.canvasY];
      this.graph.add(node, false, { doProcessChange: true });
      node.processCallbackHandlers(
        "onDropFile",
        {
          def_cb: node.onDropFile,
        },
        file,
        nodetype.widgetName || null
      );
      this.graph.onGraphChanged({ action: "fileDrop", doSave: true });
      this.graph.afterChange();
    }
  }
};

// This function has been overridden due to an error when cloning a node.  It calls selectNodes and passes
// the cloned nodes in as members of an object.
LGraphCanvas.prototype.selectNodes = function (
  nodes,
  add_to_current_selection
) {
  if (!add_to_current_selection) {
    this.deselectAllNodes();
  }

  // Start of modification
  nodes = nodes || this.graph._nodes;
  if (typeof nodes === "string") {
    nodes = [nodes];
  } else if (!Array.isArray(nodes) && typeof nodes === "object") {
    nodes = Object.values(nodes);
  }
  // end of modification

  Object.values(nodes).forEach((node) => {
    if (node.is_selected) {
      this.deselectNode(node);
      return;
    }

    node.is_selected = true;
    this.selected_nodes[node.id] = node;

    node.processCallbackHandlers("onSelected", {
      def_cb: node.onSelected,
    });

    node.inputs?.forEach((input) => {
      this.highlighted_links[input.link] = true;
    });

    node.outputs?.forEach((out) => {
      out.links?.forEach((link) => {
        this.highlighted_links[link] = true;
      });
    });
  });
  this.processCallbackHandlers(
    "onSelectionChange",
    {
      def_cb: this.onSelectionChange,
    },
    this.selected_nodes
  );
  this.setDirty(true);
};

// This function has been overridden as there was an error in the core litegraph code. The mouse up event was not sent to the
// widget when the mouse was released outside of the widget area.
// this caused numeric controls to miss the onMouseUp and as such the value would not update.

// if (e.which == 1) {
//     if (this.node_widget) {
//       this.processNodeWidgets(
//         this.node_widget[0],
//         this.graph_mouse,
//         e,
//         this.node_widget[1] // <-- This line here was added to fix the mouse up even issue
//       );
//     }
//
LGraphCanvas.prototype.processMouseUp = function (e) {
  var is_primary = e.isPrimary === undefined || e.isPrimary;

  // early exit for extra pointer
  if (!is_primary) {
    /* e.stopPropagation();
            e.preventDefault();*/
    LiteGraph.log_verbose(
      "pointerevents: processMouseUp pointerN_stop " +
        e.pointerId +
        " " +
        e.isPrimary
    );
    return false;
  }

  LiteGraph.log_verbose(
    "pointerevents: processMouseUp " +
      e.pointerId +
      " " +
      e.isPrimary +
      " :: " +
      e.clientX +
      " " +
      e.clientY
  );

  if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;

  if (!this.graph) return;

  var window = this.getCanvasWindow();
  var document = window.document;
  LGraphCanvas.active_canvas = this;

  // restore the mousemove event back to the canvas
  if (!this.options.skip_events) {
    LiteGraph.log_verbose("pointerevents: processMouseUp adjustEventListener");
    document.removeEventListener("pointermove", this._mousemove_callback, true);
    this.canvas.addEventListener("pointermove", this._mousemove_callback, true);
    document.removeEventListener("pointerup", this._mouseup_callback, true);
  }

  this.adjustMouseEvent(e);
  var now = LiteGraph.getTime();
  e.click_time = now - this.last_mouseclick;
  this.last_mouse_dragging = false;
  this.last_click_position = null;

  if (this.block_click) {
    LiteGraph.log_verbose("pointerevents: processMouseUp block_clicks");
    this.block_click = false; // used to avoid sending twice a click in a immediate button
  }

  LiteGraph.log_verbose("pointerevents: processMouseUp which: " + e.which);

  if (e.which == 1) {
    if (this.node_widget) {
      this.processNodeWidgets(
        this.node_widget[0],
        this.graph_mouse,
        e,
        this.node_widget[1]
      );
    }

    // left button
    this.node_widget = null;

    if (this.selected_group) {
      var diffx =
        this.selected_group.pos[0] - Math.round(this.selected_group.pos[0]);
      var diffy =
        this.selected_group.pos[1] - Math.round(this.selected_group.pos[1]);
      this.selected_group.move(diffx, diffy, e.ctrlKey);
      this.selected_group.pos[0] = Math.round(this.selected_group.pos[0]);
      this.selected_group.pos[1] = Math.round(this.selected_group.pos[1]);
      if (this.selected_group._nodes.length) {
        this.dirty_canvas = true;
      }

      this.selected_group.recomputeInsideNodes();

      if (this.selected_group_resizing) {
        this.processCallbackHandlers(
          "onGroupResized",
          {
            def_cb: this.onGroupResized,
          },
          this.selected_group
        );
        this.graph.onGraphChanged({ action: "groupResize", doSave: true });
        this.graph.afterChange(); // this.selected_group
      } else {
        if (diffx || diffy) {
          this.processCallbackHandlers(
            "onGroupMoved",
            {
              def_cb: this.onGroupMoved,
            },
            this.selected_group
          );
          this.graph.onGraphChanged({ action: "groupMove", doSave: true });
          this.graph.afterChange(); // this.selected_group
        }
      }
      this.selected_group = null;
    }
    this.selected_group_resizing = false;

    var node = this.graph.getNodeOnPos(
      e.canvasX,
      e.canvasY,
      this.visible_nodes
    );

    if (this.dragging_rectangle) {
      if (this.graph) {
        var nodes = this.graph._nodes;
        var node_bounding = new Float32Array(4);

        // compute bounding and flip if left to right
        var w = Math.abs(this.dragging_rectangle[2]);
        var h = Math.abs(this.dragging_rectangle[3]);
        var startx =
          this.dragging_rectangle[2] < 0
            ? this.dragging_rectangle[0] - w
            : this.dragging_rectangle[0];
        var starty =
          this.dragging_rectangle[3] < 0
            ? this.dragging_rectangle[1] - h
            : this.dragging_rectangle[1];
        this.dragging_rectangle[0] = startx;
        this.dragging_rectangle[1] = starty;
        this.dragging_rectangle[2] = w;
        this.dragging_rectangle[3] = h;

        // test dragging rect size, if minimun simulate a click
        if (!node || (w > 10 && h > 10)) {
          LiteGraph.log_debug(
            "lgraphcanvas",
            "processMouseUp",
            "computing box selection for nodes",
            this.dragging_rectangle
          );
          // test against all nodes (not visible because the rectangle maybe start outside
          var to_select = [];
          for (let i = 0; i < nodes.length; ++i) {
            var nodeX = nodes[i];
            nodeX.getBounding(node_bounding);
            if (
              !LiteGraph.overlapBounding(this.dragging_rectangle, node_bounding)
            ) {
              continue;
            } // out of the visible area
            to_select.push(nodeX);
          }
          if (to_select.length) {
            LiteGraph.log_debug(
              "lgraphcanvas",
              "processMouseUp",
              "selecting nodes",
              to_select
            );
            this.selectNodes(to_select, e.shiftKey); // add to selection with shift
          }
        } else {
          // will select of update selection
          this.selectNodes([node], e.shiftKey || e.ctrlKey); // add to selection add to selection with ctrlKey or shiftKey
        }
      }
      this.dragging_rectangle = null;
    } else if (this.connecting_node) {
      // dragging a connection
      this.dirty_canvas = true;
      this.dirty_bgcanvas = true;

      var connInOrOut = this.connecting_output || this.connecting_input;
      var connType = connInOrOut.type;

      node = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);

      // node below mouse
      if (node) {
        // slot below mouse? connect
        let slot;
        if (this.connecting_output) {
          LiteGraph.log_debug(
            "lgraphcanvas",
            "processMouseUp",
            "connecting_output",
            this.connecting_output,
            "connecting_node",
            this.connecting_node,
            "connecting_slot",
            this.connecting_slot
          );
          slot = this.isOverNodeInput(node, e.canvasX, e.canvasY);
          if (slot != -1) {
            this.connecting_node.connect(this.connecting_slot, node, slot);
          } else {
            // not on top of an input
            // look for a good slot
            this.connecting_node.connectByType(
              this.connecting_slot,
              node,
              connType
            );
          }
        } else if (this.connecting_input) {
          LiteGraph.log_debug(
            "lgraphcanvas",
            "processMouseUp",
            "connecting_input",
            this.connecting_input,
            "connecting_node",
            this.connecting_node,
            "connecting_slot",
            this.connecting_slot
          );
          slot = this.isOverNodeOutput(node, e.canvasX, e.canvasY);

          if (slot != -1) {
            if (this.connecting && this.connecting.inputs) {
              // multi connect
              for (let iC in this.connecting.inputs) {
                node.connect(
                  slot,
                  this.connecting.inputs[iC].node,
                  this.connecting.inputs[iC].slot
                );
              }
            } else {
              // default single connect
              node.connect(slot, this.connecting_node, this.connecting_slot); // this is inverted has output-input nature like
            }
          } else {
            // not on top of an input
            // look for a good slot
            this.connecting_node.connectByTypeOutput(
              this.connecting_slot,
              node,
              connType
            );
          }
        }
        // }
      } else {
        // add menu when releasing link in empty space
        if (LiteGraph.release_link_on_empty_shows_menu) {
          if (e.shiftKey && this.allow_searchbox) {
            if (this.connecting_output) {
              this.showSearchBox(e, {
                node_from: this.connecting_node,
                slot_from: this.connecting_output,
                type_filter_in: this.connecting_output.type,
              });
            } else if (this.connecting_input) {
              this.showSearchBox(e, {
                node_to: this.connecting_node,
                slot_from: this.connecting_input,
                type_filter_out: this.connecting_input.type,
              });
            }
          } else {
            if (this.connecting_output) {
              this.showConnectionMenu({
                nodeFrom: this.connecting_node,
                slotFrom: this.connecting_output,
                e: e,
              });
            } else if (this.connecting_input) {
              this.showConnectionMenu({
                nodeTo: this.connecting_node,
                slotTo: this.connecting_input,
                e: e,
              });
            }
          }
        }
      }

      this.connecting_output = null;
      this.connecting_input = null;
      this.connecting_pos = null;
      this.connecting_node = null;
      this.connecting_slot = -1;
      this.connecting = false;
    } else if (this.resizing_node) {
      // not dragging connection
      this.dirty_canvas = true;
      this.dirty_bgcanvas = true;
      this.graph.afterChange(this.resizing_node);
      this.resizing_node = null;
    } else if (this.node_dragged) {
      // node being dragged?
      node = this.node_dragged;
      if (
        node &&
        e.click_time < 300 &&
        LiteGraph.isInsideRectangle(
          e.canvasX,
          e.canvasY,
          node.pos[0],
          node.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
          LiteGraph.NODE_TITLE_HEIGHT,
          LiteGraph.NODE_TITLE_HEIGHT
        )
      ) {
        node.collapse();
      }

      this.dirty_canvas = true;
      this.dirty_bgcanvas = true;
      this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]);
      this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]);
      if (this.graph.config.align_to_grid || this.align_to_grid) {
        this.node_dragged.alignToGrid();
      }
      // TAG callback graphrenderer event entrypoint
      this.processCallbackHandlers(
        "onNodeMoved",
        {
          def_cb: this.onNodeMoved,
        },
        this.node_dragged,
        this.selected_nodes
      );
      // multi nodes dragged ?
      for (let i in this.selected_nodes) {
        let ndrg = this.selected_nodes[i];
        ndrg.processCallbackHandlers(
          "onMoved",
          {
            def_cb: ndrg.onMoved,
          },
          this.node_dragged,
          this.selected_nodes
        );
      }
      this.graph.onGraphChanged({ action: "nodeDrag", doSave: true });
      this.graph.afterChange(this.node_dragged);
      this.node_dragged = null;
    } else {
      // no node being dragged
      // get node over
      node = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);

      if (!node && e.click_time < 300) {
        this.deselectAllNodes();
      }

      this.dirty_canvas = true;
      this.dragging_canvas = false;

      if (this.node_over) {
        // TAG callback node event entrypoint
        this.node_over.processCallbackHandlers(
          "onMouseUp",
          {
            def_cb: this.node_over.onMouseUp,
          },
          e,
          [
            e.canvasX - this.node_over.pos[0],
            e.canvasY - this.node_over.pos[1],
          ],
          this
        );
      }
      if (this.node_capturing_input) {
        // TAG callback node event entrypoint
        this.node_capturing_input.processCallbackHandlers(
          "onMouseUp",
          {
            def_cb: this.node_capturing_input.onMouseUp,
          },
          e,
          [
            e.canvasX - this.node_capturing_input.pos[0],
            e.canvasY - this.node_capturing_input.pos[1],
          ]
        );
      }
    }
  } else if (e.which == 2) {
    // middle button
    // trace("middle");
    this.dirty_canvas = true;
    this.dragging_canvas = false;
  } else if (e.which == 3) {
    // right button
    // trace("right");
    this.dirty_canvas = true;
    this.dragging_canvas = false;
  }

  /*
        if((this.dirty_canvas || this.dirty_bgcanvas) && this.rendering_timer_id == null)
            this.draw();
        */

  if (is_primary) {
    this.pointer_is_down = false;
    this.pointer_is_double = false;
  }

  this.graph.change();

  LiteGraph.log_verbose("pointerevents: processMouseUp stopPropagation");
  e.stopPropagation();
  e.preventDefault();
  return false;
};

// added to prevent error with no return value
LGraphCanvas.prototype.onDropItem = function (e) {
  return {
    return_value: false,
    result_priority: 0,
    prevent_default: false,
    stop_replication: false,
  };
};

export { LGraphCanvas };
