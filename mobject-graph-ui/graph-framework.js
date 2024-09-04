import { LiteGraph } from "/litegraph/src/litegraph.js";
import { Widgets } from "./widgets.js";
import { NodeClassFactory } from "./node-class-factory.js";
import {
  NodeInputPortBlueprintHandler,
  NodeOutputPortBlueprintHandler,
  NodeParametersBlueprintHandler,
  NodeContentsBlueprintHandler,
} from "./node-blueprint-handlers.js";

// look after the widgets
// have a .RegisterNodesByBlueprint
// have a .RegisterDatatypesByBlueprint
// wrap LiteGraph

// method .Create(); returns graph

/**
 * GraphFramework is a dynamic proxy class designed to wrap the LiteGraph library.
 *
 * This wrapper provides an interface to all existing methods of LiteGraph through automatic delegation,
 * enabling transparent use of its functionalities. The proxy approach allows this wrapper to automatically
 * forward calls to LiteGraph methods that are not explicitly defined in this class.
 * This makes the wrapper highly maintainable and extensible, as it does not need to be updated with each
 * change in the LiteGraph API. Additionally, it provides an easy way to extend or override specific methods
 * of LiteGraph for customization or enhancement, such as adding logging, custom error handling, or other features.
 *
 * Use this wrapper to leverage all of LiteGraph's capabilities while maintaining the flexibility to extend
 * and customize its behavior as needed for your specific application requirements.
 */
export class GraphFramework {
  static instance;

  debug = false;

  constructor() {
    if (GraphFramework.instance) {
      return GraphFramework.instance;
    }

    if (typeof LiteGraph === "undefined") {
      throw new Error("LiteGraph is not available in the global scope.");
    }

    this.liteGraph = LiteGraph;
    this.widgets = new Widgets();

    this.liteGraph.unregisterNodeType("graph/subgraph");
    this.liteGraph.unregisterNodeType("graph/input");
    this.liteGraph.unregisterNodeType("graph/output");

    this.nodeClassFactory = new NodeClassFactory(this.widgets);
    this.nodeClassFactory.registerHandler(new NodeInputPortBlueprintHandler());
    this.nodeClassFactory.registerHandler(new NodeOutputPortBlueprintHandler());
    this.nodeClassFactory.registerHandler(
      new NodeParametersBlueprintHandler(this.widgets)
    );
    this.nodeClassFactory.registerHandler(
      new NodeContentsBlueprintHandler(this.widgets)
    );

    this.liteGraph.computeTextWidth = function (text, fontSize) {
      if (!text) {
        return 0;
      }

      let t = text.toString();

      if (typeof fontSize === "undefined")
        return this.NODE_TEXT_SIZE * t.length * 0.6;

      return this.NODE_TEXT_SIZE * t.length * fontSize;
    };

    GraphFramework.instance = new Proxy(this, {
      get: (target, property, receiver) => {
        if (Reflect.has(target, property)) {
          return Reflect.get(target, property, receiver);
        } else {
          return (...args) => {
            if (typeof target.liteGraph[property] === "function") {
              return target.liteGraph[property].apply(target.liteGraph, args);
            } else {
              return target.liteGraph[property];
            }
          };
        }
      },
    });

    return GraphFramework.instance;
  }

  log(...args) {
    if (!this.debug) return;
    console.log(...args);
  }

  install(graphPack) {
    graphPack.install(this);
  }

  installNodeBlueprints(blueprints) {
    if (blueprints && Array.isArray(blueprints)) {
      blueprints.forEach((blueprint) => {
        this.installNodeBlueprint(blueprint);
      });
    }
  }

  installNodeBlueprint(blueprint) {
    if (blueprint) {
      const nodeType =
        this.nodeClassFactory.getNodeTypeFromBlueprint(blueprint);
      if (!nodeType) {
        this.log("Failed to determine node type from blueprint.");
        return;
      }

      const nodeClass = this.nodeClassFactory.create(blueprint);
      if (!nodeClass) {
        this.log(
          "Unable to create node class from blueprint.",
          nodeType,
          blueprint
        );
        return;
      }
      this.registerNodeClass(nodeType, nodeClass);
    } else {
      this.log("No blueprint provided to installNodeBlueprint.");
    }
  }

  registerWidgetType(Widget, type, identifier) {
    this.widgets.add(Widget, type, identifier);
  }

  registerFileAssociation(fileExtensions, nodeType, widgetName = null) {
    for (let fileExtension of fileExtensions) {
      if (fileExtension && typeof fileExtension === "string") {
        this.liteGraph.node_types_by_file_extension[
          fileExtension.toLowerCase()
        ] = {
          type: nodeType,
          widgetName,
        };
      }
    }
  }

  getVersion() {
    return this.liteGraph.VERSION;
  }

  /* this method was overridden as it was incorrectly overwriting the prototype
   ** of our base class, as such this was made.  Also, some of the unused parts
   ** were removed to simplfiy the call
   */
  registerNodeClass(type, base_class) {
    base_class.type = type;
    const classname = base_class.name;

    const pos = type.lastIndexOf("/");
    base_class.category = type.substring(0, pos);

    if (!base_class.title) {
      base_class.title = classname;
    }

    if (base_class.supported_extensions) {
      for (let i in base_class.supported_extensions) {
        const ext = base_class.supported_extensions[i];
        if (ext && ext.constructor === String) {
          this.liteGraph.node_types_by_file_extension[ext.toLowerCase()] =
            base_class;
        }
      }
    }

    const prev = this.liteGraph.registered_node_types[type];

    if (prev) {
      this.log_debug("registerNodeType", "replacing node type", type, prev);
    }

    this.liteGraph.registered_node_types[type] = base_class;
    if (base_class.constructor.name) {
      this.liteGraph.Nodes[classname] = base_class;
    }

    this.processCallbackHandlers(
      "onNodeTypeRegistered",
      {
        def_cb: this.onNodeTypeRegistered,
      },
      type,
      base_class
    );

    if (prev) {
      this.processCallbackHandlers(
        "onNodeTypeReplaced",
        {
          def_cb: this.onNodeTypeReplaced,
        },
        type,
        base_class,
        prev
      );
    }

    // warnings
    if (base_class.prototype.onPropertyChange) {
      LiteGraph.log_warn(
        "LiteGraph node class " +
          type +
          " has onPropertyChange method, it must be called onPropertyChanged with d at the end"
      );
    }

    // used to know which nodes create when dragging files to the canvas
    if (base_class.supported_extensions) {
      for (var i = 0; i < base_class.supported_extensions.length; i++) {
        var ext = base_class.supported_extensions[i];
        if (ext && ext.constructor === String)
          this.node_types_by_file_extension[ext.toLowerCase()] = base_class;
      }
    }

    this.log_debug("registerNodeType", "type registered", type);

    if (this.auto_load_slot_types) {
      // auto_load_slot_types should be used when not specifing slot type to LiteGraph
      // good for testing: this will create a temporary node for each type
      this.log_debug(
        "registerNodeType",
        "auto_load_slot_types, create empy tmp node",
        type
      );
      let tmpnode = new base_class(base_class.title ?? "tmpnode");
      tmpnode.post_constructor(); // could not call, but eventually checking for errors in the chain ?
    }
  }
}
