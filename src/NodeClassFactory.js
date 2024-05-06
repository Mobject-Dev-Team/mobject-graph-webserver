class NodeClassFactory {
  constructor() {
    this.handlers = new NodeBlueprintHandlers();
  }

  registerHandler(handler) {
    this.handlers.addHandler(handler);
  }

  removeHandler(handler) {
    this.handlers.removeHandler(handler);
  }

  validateBlueprint(blueprint) {
    return blueprint.path;
  }

  getNodeNameFromBlueprint(blueprint) {
    return blueprint.path.split("/").pop();
  }

  getNodePathFromBlueprint(blueprint) {
    let path = blueprint.path.split("/").slice(0, -1).join("/");
    return path;
  }

  getNodeTypeFromBlueprint(blueprint) {
    return blueprint.path;
  }

  create(blueprint) {
    if (!this.validateBlueprint(blueprint)) {
      throw new Error("Invalid blueprint structure");
    }

    const factory = this;
    const nodeName = factory.getNodeNameFromBlueprint(blueprint);

    const nodeClass = class extends Node {
      constructor() {
        super(nodeName);
        factory.handlers.handle(this, blueprint.node);
      }
    };

    Object.defineProperty(nodeClass, "name", {
      value: nodeName,
      writable: false,
    });

    // Object.defineProperty(nodeClass, "skip_list", {
    //   value: true,
    //   writable: false,
    // });

    return nodeClass;
  }
}
