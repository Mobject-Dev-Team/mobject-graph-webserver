class NodeBlueprintHandlers {
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

  handle(node, blueprint) {
    let index = 0;
    const next = () => {
      if (index < this.handlers.length) {
        const handler = this.handlers[index++];
        handler.handle(node, blueprint, next);
      }
    };
    next();
  }
}

class NodeBlueprintHandler {
  handle(node, blueprint, next) {
    next();
  }
}

class NodeInputPortBlueprintHandler extends NodeBlueprintHandler {
  handle(node, blueprint, next) {
    if (blueprint.inputPorts) {
      blueprint.inputPorts.forEach((input) =>
        node.addInput(input.name, input.datatype.type)
      );
    }
    next();
  }
}

class NodeOutputPortBlueprintHandler extends NodeBlueprintHandler {
  handle(node, blueprint, next) {
    if (blueprint.outputPorts) {
      blueprint.outputPorts.forEach((output) =>
        node.addOutput(output.name, output.datatype.type)
      );
    }
    next();
  }
}

class NodeParametersBlueprintHandler extends NodeBlueprintHandler {
  constructor(widgets) {
    super();
    this.widgets = widgets;
  }

  handle(node, blueprint, next) {
    const contentNames = new Set(
      blueprint.contents ? blueprint.contents.map((c) => c.name) : []
    );

    if (blueprint.parameters) {
      blueprint.parameters.forEach((parameter) => {
        const name = parameter.name;
        const type = parameter.datatype.type;
        const default_value = parameter.defaultValue;
        const prop = node.addProperty(name, default_value, type);

        let content;
        if (contentNames.has(name)) {
          content = blueprint.contents.find((c) => c.name === name);
        }

        const widgetClasses = this.widgets.getControlsOfType(type);
        if (!widgetClasses.length) {
          throw new Error(`Unable to find widget of type :  ${type}`);
        }
        const widget = new widgetClasses[0](name, prop, parameter, content);

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
  handle(node, blueprint, next) {
    const parameterNames = new Set(
      blueprint.parameters
        ? blueprint.parameters.map((parameter) => parameter.name)
        : []
    );

    if (blueprint.contents) {
      blueprint.contents.forEach((content) => {
        if (parameterNames.has(content.name)) return; // already processed by NodeParametersBlueprint
        const name = content.name;
        const type = content.datatype.type;

        const widgetClasses = this.widgets.getDisplaysOfType(type);
        if (!widgetClasses.length) {
          throw new Error(`Unable to find widget of type :  ${type}`);
        }
        const widget = new widgetClasses[0](name, content);

        node.addCustomWidget(widget);
      });
    }
    next();
  }
}
