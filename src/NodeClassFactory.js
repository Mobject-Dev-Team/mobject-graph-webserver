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
    return blueprint.path.split(".").pop();
  }

  getNodePathFromBlueprint(blueprint) {
    let path = blueprint.path.split(".").slice(0, -1).join("/");
    return path
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^ /, "");
  }

  getNodeTypeFromBlueprint(blueprint) {
    const path = this.getNodePathFromBlueprint(blueprint);
    const name = this.getNodeNameFromBlueprint(blueprint);
    return `${path}${path ? "/" : ""}${name.replace(/([A-Z])/g, " $1").trim()}`;
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

    return nodeClass;
  }
}
