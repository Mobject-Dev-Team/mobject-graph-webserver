class NodeBlueprintHandlerChain {
  constructor() {
    this.handlers = [];
  }

  addHandler(handler) {
    this.handlers.push(handler);
    this.updateChain();
  }

  removeHandler(handler) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
      this.updateChain();
    }
  }

  updateChain() {
    for (let i = 0; i < this.handlers.length - 1; i++) {
      this.handlers[i].setNext(this.handlers[i + 1]);
    }
    if (this.handlers.length) {
      this.handlers[this.handlers.length - 1].setNext(null);
    }
  }

  handle(node, blueprint) {
    if (this.handlers.length) {
      this.handlers[0].handle(node, blueprint);
    }
  }
}

class NodeBlueprintHandler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  handle(node, blueprint) {
    if (this.nextHandler) {
      this.nextHandler.handle(node, blueprint);
    }
  }
}

class NodeInputPortBlueprintHandler extends NodeBlueprintHandler {
  handle(node, blueprint) {
    console.log(blueprint);
    if (blueprint.inputPorts) {
      blueprint.inputPorts.forEach((input) =>
        node.addInput(input.name, input.datatype.type)
      );
    }
    super.handle(node, blueprint);
  }
}

class NodeOutputPortBlueprintHandler extends NodeBlueprintHandler {
  handle(node, blueprint) {
    if (blueprint.outputPorts) {
      blueprint.outputPorts.forEach((output) =>
        node.addOutput(output.name, output.datatype.type)
      );
    }
    super.handle(node, blueprint);
  }
}
