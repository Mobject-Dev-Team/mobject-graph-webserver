class Graph extends LGraph {
  constructor(o) {
    super(o);

    this.MAXIMUM_UNDO = 20;
    this.DEBOUNCE_TIMEOUT = 500;

    this.timer = null;
    this.timeout = this.DEBOUNCE_TIMEOUT;

    this.block_configure_events = false;

    this.statusHandlers = [];

    this.abilities = [];
    this.addAbility(GraphRouterMemoryAbility);

    this.registerWidgetByType("NUMBER", Widget_Number);
    this.registerWidgetByType("COMBO", Widget_Combo);
    this.registerWidgetByType("SLIDER", Widget_Slider);
    this.registerWidgetByType("SEPARATOR", Widget_Separator);
    this.registerWidgetByType("BLANK", Widget_Blank);

    this.registerWidgetByType("BOOL", Widget_Bool);
    this.registerWidgetByType("STRING", Widget_String);
    this.registerWidgetByType("BYTE", Widget_IecAnyInteger);
    this.registerWidgetByType("DINT", Widget_IecAnyInteger);
    this.registerWidgetByType("DWORD", Widget_IecAnyInteger);
    this.registerWidgetByType("INT", Widget_IecAnyInteger);
    this.registerWidgetByType("LINT", Widget_IecAnyInteger);
    this.registerWidgetByType("LWORD", Widget_IecAnyInteger);
    this.registerWidgetByType("SINT", Widget_IecAnyInteger);
    this.registerWidgetByType("UDINT", Widget_IecAnyInteger);
    this.registerWidgetByType("UINT", Widget_IecAnyInteger);
    this.registerWidgetByType("ULINT", Widget_IecAnyInteger);
    this.registerWidgetByType("USINT", Widget_IecAnyInteger);
    this.registerWidgetByType("WORD", Widget_IecAnyInteger);
    this.registerWidgetByType("LREAL", Widget_IecAnyFloat);
    this.registerWidgetByType("REAL", Widget_IecAnyFloat);

    this.registerWidgetByType("ENUM", Widget_IecEnum);
  }

  install = function (nodePack) {
    nodePack.RegisterWithGraph(this);
  };

  addNewIecDataType = function (dataTypeAsString) {
    LiteGraph.addIecDataType(dataTypeAsString);
  };

  registerNodeByType = function (type, node) {
    LiteGraph.registerNodeType(type, node);
  };

  registerWidgetByType = function (type, widget) {
    LiteGraph.addVisualWidgetByType(widget, type);
  };

  registerStatusHandler(handler) {
    this.statusHandlers.push(handler);
  }

  addAbility(ability) {
    this.abilities.push(new ability(this));
  }

  // new method used to indicate a structure change has happened in the graph.
  configurationHasChanged() {
    this.uuid = generateUUID();

    if (this.onConfigurationHasChanged) {
      this.onConfigurationHasChanged();
    }

    this.generateUndoPoint();
  }

  // new method used by nodes to notify when a property has been changed
  propertyHasChanged(node, name, value) {
    const graph = this;

    clearTimeout(graph.timer);
    this.timer = setTimeout(function () {
      if (graph.onPropertyHasChanged) {
        graph.onPropertyHasChanged(node, name, value);
      }
      graph.generateUndoPoint();
    }, graph.timeout);
  }

  // catch LGraph onConfigure to trigger configuration has changed event
  onConfigure(data) {
    this.block_configure_events = false;
    this.configurationHasChanged();
  }

  // catch LGraph onSerialize to add the uuid to the json
  onSerialize(data) {
    data.uuid = this.uuid;

    if (this.onSerializeExtended) {
      data = this.onSerializeExtended(data);
    }

    return data;
  }

  // catch LGraph onNodeAdded to trigger configuration has changed event
  onNodeAdded(node) {
    if (!this.block_configure_events) {
      this.configurationHasChanged();
    }
  }

  // catch LGraph onNodeRemoved to trigger configuration has changed event
  onNodeRemoved(node) {
    if (!this.block_configure_events) {
      this.configurationHasChanged();
    }
  }

  // catch LGraph onNodeConnectionChange to trigger configuration has changed event
  connectionChange(node, link_info) {
    if (!this.block_configure_events) {
      this.configurationHasChanged();
    }
  }

  // request a graph undo
  undo() {
    if (this.undoData.end - this.undoData.begin <= 0) {
      return;
    }

    if (this.undoData.current_position <= this.undoData.begin) {
      this.undoData.current_position = this.undoData.begin;
      return;
    }

    this.undoData.disable = true;
    this.undoData.current_position--;
    this.configure(
      JSON.parse(this.undoData["undoPoint_" + this.undoData.current_position])
    );
    this.undoData.disable = false;
  }

  // request a graph redo
  redo() {
    if (this.undoData.current_position >= this.undoData.end) {
      this.undoData.current_position = this.undoData.end;
      return;
    }

    this.undoData.disable = true;
    this.undoData.current_position++;
    this.configure(
      JSON.parse(this.undoData["undoPoint_" + this.undoData.current_position])
    );
    this.undoData.disable = false;
  }

  // undo point generation
  generateUndoPoint() {
    if (typeof this.undoData == "undefined") {
      this.undoData = { begin: 1, end: 1, current_position: 0, disable: false };
    }

    if (this.undoData.disable == true) {
      return;
    }

    if (this.undoData.current_position < this.undoData.end) {
      for (
        var i = this.undoData.current_position + 1;
        i <= this.undoData.end;
        i++
      ) {
        delete this.undoData["undoPoint_" + i];
      }
      this.undoData.end = this.undoData.current_position;
    }

    if (this.undoData.end - this.undoData.begin == this.MAXIMUM_UNDO) {
      delete this.undoData["undoPoint_" + this.undoData.begin];
      this.undoData.begin++;
    }

    this.undoData.end++;
    this.undoData.current_position++;
    this.undoData["undoPoint_" + this.undoData.current_position] =
      JSON.stringify(this.serialize());
  }

  // save graph to file
  save() {
    var data = JSON.stringify(this.serialize());
    var file = new Blob([data]);
    var url = URL.createObjectURL(file);
    var element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("download", "untitled.tcgraph");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000 * 60);
  }

  // load graph from file
  load() {
    var graph = this;

    if (typeof FileReader === "undefined") {
      console.log("File loading not supported by your browser");
      return;
    }

    var inputElement = document.createElement("input");

    inputElement.type = "file";
    inputElement.accept = ".tcgraph";
    inputElement.multiple = false;

    inputElement.addEventListener("change", function (data) {
      if (inputElement.files) {
        var file = inputElement.files[0];
        var reader = new FileReader();

        reader.addEventListener("loadend", function (load_data) {
          if (reader.result) graph.configure(JSON.parse(reader.result));
        });
        reader.addEventListener("error", function (load_data) {
          console.log("File load error");
        });

        reader.readAsText(file);
      }
    });

    inputElement.click();
    return;
  }

  // called by the api
  updateStatus(status) {
    var graph = this;

    if (!status) {
      return;
    }

    // graph status -------------------
    if (status.content) {
      status.content.forEach(updateGraphStatus);

      function updateGraphStatus(graphStatus, index, array) {
        graph.statusHandlers.forEach(function (statusHandler) {
          statusHandler(graphStatus, graph);
        });
        graph.setDirtyCanvas(false, true);
      }
    }

    // node status -------------------
    if (status.nodes) {
      status.nodes.forEach(updateNodeStatus);

      var nodePanel = document.querySelector("#node-panel");

      if (nodePanel) {
        nodePanel.refreshPanel();
      }

      function updateNodeStatus(nodeStatus, index, array) {
        let nodeId = nodeStatus.id;
        let node = graph.getNodeById(nodeId);

        if (!node) {
          return;
        }

        node.statusHandlers.forEach(function (statusHandler) {
          statusHandler(nodeStatus, node);
        });

        node.has_errors = nodeStatus.error && nodeStatus.error.length > 0;

        node.currentStatus = nodeStatus;

        graph.setDirtyCanvas(false, true);
      }
    }
  }

  // overrides
  // sections below have been added to override the core function of LGraph.
  // -------------------------------------------------------------------------------------------------------------

  // LGraph.configure(data, keep_old)
  // --------------------------------
  // This method was modified to add the block_configure_events bool.
  // this is used to prevent undo points from being incorrectly made during a configure
  configure(data, keep_old) {
    this.block_configure_events = true;
    super.configure(data, keep_old);
  }

  // LGraph.clear()
  // --------------
  // This method was modified to trigger "configurationHasChanged" only if manually called, and not as a result
  // of being called by "configure".  This uses the block_configure_events to decide this.
  clear() {
    super.clear();
    if (!this.block_configure_events) {
      this.configurationHasChanged();
    }
  }

  // LGraph.start()
  // --------------
  // This method was modified to trigger "configurationHasChanged"
  start(interval) {
    super.start(interval);
    this.configurationHasChanged();
  }

  // LGraph.attachCanvas(graphcanvas)
  // --------------------------------
  // This method was mofidifed to allow for a new constructor check.
  // initially LGraphCanvas, but changed to GraphCanvas
  attachCanvas(graphcanvas) {
    if (graphcanvas.constructor != GraphCanvas) {
      // <- this line was changed
      throw "attachCanvas expects a GraphCanvas instance";
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
