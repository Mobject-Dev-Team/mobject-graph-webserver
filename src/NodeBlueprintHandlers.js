class NodeBlueprintHandlerChain {
  constructor() {
    this.handlers = [];
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  handle(node, blueprint, factory) {
    let index = 0;
    const next = () => {
      if (index < this.handlers.length) {
        const handler = this.handlers[index++];
        handler.handle(node, blueprint, factory, next);
      }
    };
    next();
  }
}

class NodeBlueprintHandler {
  handle(node, blueprint, factory, next) {
    next();
  }
}

class NodeInputPortBlueprintHandler extends NodeBlueprintHandler {
  handle(node, blueprint, factory, next) {
    if (blueprint.inputPorts) {
      blueprint.inputPorts.forEach((input) =>
        node.addInput(input.name, input.datatype.type)
      );
    }
    next();
  }
}

class NodeOutputPortBlueprintHandler extends NodeBlueprintHandler {
  handle(node, blueprint, factory, next) {
    if (blueprint.outputPorts) {
      blueprint.outputPorts.forEach((output) =>
        node.addOutput(output.name, output.datatype.type)
      );
    }
    next();
  }
}

// find the widget blueprint handler which matches the type+identifier,
// create the w
class NodeParametersBlueprintHandler extends NodeBlueprintHandler {
  constructor(widgets) {
    super();
    this.widgets = widgets;
  }

  handle(node, blueprint, factory, next) {
    if (blueprint.parameters) {
      blueprint.parameters.forEach((parameter) => {
        const widgetClass = this.widgets.get(parameter.datatype.type);
        const widget = new widgetClass(parameter.name, parameter);
        node.addCustomWidget(widget);
      });
    }
    next();
  }
}

class NodeContentsBlueprintHandler extends NodeBlueprintHandler {
  constructor(widgets) {
    super();
    this.widgets = widgets;
  }
  handle(node, blueprint, factory, next) {
    if (blueprint.contents) {
      blueprint.contents.forEach((content) => console.log(content));
    }
    next();
  }
}
