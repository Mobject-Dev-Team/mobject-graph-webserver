import { NodeBlueprintHandlers } from "./node-blueprint-handlers.js";
import { Node } from "./node.js";

export class NodeClassFactory {
  constructor(widgets) {
    this.widgets = widgets;
    this.handlers = new NodeBlueprintHandlers();
  }

  registerHandler(handler) {
    this.handlers.addHandler(handler);
  }

  removeHandler(handler) {
    this.handlers.removeHandler(handler);
  }

  validateBlueprint(blueprint) {
    const validations = [
      this.checkBlueprintHasPath.bind(this),
      this.checkBlueprintParametersAreSupported.bind(this),
      this.checkBlueprintContentsAreSupported.bind(this),
    ];

    return validations.every((validation) => validation(blueprint));
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

  checkBlueprintHasPath(blueprint) {
    return blueprint.path;
  }

  checkBlueprintParametersAreSupported(blueprint) {
    if (!blueprint.node.parameters) return true;

    return blueprint.node.parameters.every((parameter) => {
      const { typeName, identifier } = parameter.datatype;
      return this.widgets.hasControl(typeName, identifier);
    });
  }

  checkBlueprintContentsAreSupported(blueprint) {
    if (!blueprint.node.contents) return true;

    const parameterSet = new Set(
      (blueprint.node?.parameters || []).map(
        (p) => `${p.datatype.typeName}-${p.datatype.identifier}`
      )
    );

    return blueprint.node.contents.every((content) => {
      const { typeName, identifier } = content.datatype;
      const key = `${typeName}-${identifier}`;
      if (
        parameterSet.has(key) &&
        this.widgets.hasControl(typeName, identifier)
      ) {
        return true;
      }
      return this.widgets.hasDisplay(typeName, identifier);
    });
  }

  create(blueprint) {
    if (!this.validateBlueprint(blueprint)) {
      return;
    }

    const factory = this;
    const nodeName = factory.getNodeNameFromBlueprint(blueprint);

    const nodeClass = class extends Node {
      static title = nodeName;
      static desc = "";

      constructor() {
        super(nodeName);
        factory.handlers.handle(this, blueprint.node);
      }
    };

    return nodeClass;
  }
}
