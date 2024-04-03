class NodeFactoryManager {
  constructor(LiteGraph) {
    this.liteGraph = LiteGraph;
    this.handlerChain = new NodeBlueprintHandlerChain();
    this.handlerChain.addHandler(new NodeInputPortBlueprintHandler());
    this.handlerChain.addHandler(new NodeOutputPortBlueprintHandler());
  }

  registerHandler(handler) {
    this.handlerChain.addHandler(handler);
  }

  removeHandler(handler) {
    this.handlerChain.removeHandler(handler);
  }

  validateBlueprint(blueprint) {
    return blueprint.path;
  }

  getName(input) {
    return input.split(".").pop();
  }

  getPath(input) {
    let path = input.split(".").slice(0, -1).join("/");
    return path
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^ /, "");
  }

  getFullPath(input) {
    const path = this.getPath(input);
    const name = this.getName(input);
    return `${path}${path ? "/" : ""}${name.replace(/([A-Z])/g, " $1").trim()}`;
  }

  registerNodesFromBlueprints(blueprints) {
    if (blueprints && Array.isArray(blueprints)) {
      blueprints.forEach((blueprint) => {
        this.registerNodeFromBlueprint(blueprint);
      });
    }
  }

  registerNodeFromBlueprint(blueprint) {
    const nodeClass = this.createNode(blueprint);

    this.liteGraph.registerNodeType(
      this.getFullPath(blueprint.path),
      nodeClass
    );
  }

  createNode(blueprint) {
    if (!this.validateBlueprint(blueprint)) {
      throw new Error("Invalid blueprint structure");
    }

    const manager = this;

    const DynamicNodeClass = class extends Node {
      constructor() {
        super(manager.getName(blueprint.path));
        manager.handlerChain.handle(this, blueprint.node);
      }
    };

    Object.defineProperty(DynamicNodeClass, "name", {
      value: manager.getName(blueprint.path),
      writable: false,
    });

    return DynamicNodeClass;
  }
}
