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
class GraphFramework {
  constructor() {
    if (typeof LiteGraph === "undefined") {
      throw new Error("LiteGraph is not available in the global scope.");
    }

    this.liteGraph = LiteGraph;
    this.widgets = new Widgets();

    this.nodeClassFactory = new NodeClassFactory();
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

    return new Proxy(this, {
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
      const nodeClass = this.nodeClassFactory.create(blueprint);
      const nodeType =
        this.nodeClassFactory.getNodeTypeFromBlueprint(blueprint);

      this.registerNodeType(nodeType, nodeClass);
    }
  }

  registerWidgetType(Widget, type, identifier) {
    this.widgets.add(Widget, type, identifier);
  }

  getVersion() {
    return this.liteGraph.VERSION;
  }

  /* this method was overridden as it was incorrectly overwriting the prototype
   ** of our base class, as such this was made.  Also, some of the unused parts
   ** were removed to simplfiy the call
   */
  registerNodeType(type, base_class) {
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
    this.liteGraph.registered_node_types[type] = base_class;
    if (base_class.constructor.name) {
      this.liteGraph.Nodes[classname] = base_class;
    }
    if (this.liteGraph.onNodeTypeRegistered) {
      this.liteGraph.onNodeTypeRegistered(type, base_class);
    }
    if (prev && this.liteGraph.onNodeTypeReplaced) {
      this.liteGraph.onNodeTypeReplaced(type, base_class, prev);
    }
  }

  create() {
    return new Graph();
  }
}
