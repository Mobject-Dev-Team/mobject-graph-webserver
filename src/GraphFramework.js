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
        return this.liteGraph.NODE_TEXT_SIZE * t.length * 0.6;

      return this.liteGraph.NODE_TEXT_SIZE * t.length * fontSize;
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

      this.liteGraph.registerNodeType(nodeType, nodeClass);
    }
  }

  registerWidgetType(Widget, type, identifier) {
    this.widgets.add(Widget, type, identifier);
  }

  getVersion() {
    return this.liteGraph.VERSION;
  }

  create() {
    return new Graph();
  }
}
