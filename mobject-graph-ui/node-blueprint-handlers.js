export class NodeBlueprintHandlers {
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

export class NodeBlueprintHandler {
  handle(node, blueprint, next) {
    next();
  }
}

// Helper function to recursively gather types and base types
function getType(datatype) {
  let typeString = datatype.identifier
    ? `${datatype.typeName} (${datatype.identifier})`
    : datatype.typeName;

  // Check if there's a baseDatatype and append it recursively
  if (datatype.baseDatatype) {
    typeString += `,${getType(datatype.baseDatatype)}`;
  }

  return typeString;
}

export class NodeInputPortBlueprintHandler extends NodeBlueprintHandler {
  handle(node, blueprint, next) {
    if (blueprint.inputPorts) {
      blueprint.inputPorts.forEach((input) => {
        const type = getType(input.datatype);
        node.addInput(input.name, type);
      });
    }
    next();
  }
}

export class NodeOutputPortBlueprintHandler extends NodeBlueprintHandler {
  handle(node, blueprint, next) {
    if (blueprint.outputPorts) {
      blueprint.outputPorts.forEach((output) => {
        const type = getType(output.datatype);
        node.addOutput(output.name, type);
      });
    }
    next();
  }
}

export class NodeParametersBlueprintHandler extends NodeBlueprintHandler {
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
        const typeName = parameter.datatype.typeName;
        const identifier = parameter.datatype.identifier;
        const type = parameter.datatype.identifier
          ? `${parameter.datatype.typeName} (${parameter.datatype.identifier})`
          : parameter.datatype.typeName;
        const default_value = parameter.defaultValue;
        const prop = node.addProperty(name, default_value, type);

        let content;
        if (contentNames.has(name)) {
          content = blueprint.contents.find((c) => c.name === name);
        }

        const widgetClasses = this.widgets.getControlsOfType(
          typeName,
          identifier
        );
        if (!widgetClasses.length) {
          throw new Error(`Unable to find widget of type :  ${type}`);
        }
        const widget = new widgetClasses[0](name, node, {
          property: prop,
          parameter,
          content,
        });

        node.addCustomWidget(widget);
      });
    }
    next();
  }
}

export class NodeContentsBlueprintHandler extends NodeBlueprintHandler {
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
        const typeName = content.datatype.typeName;
        const identifier = content.datatype.identifier || "";
        const type = content.datatype.identifier
          ? `${content.datatype.typeName} (${content.datatype.identifier})`
          : content.datatype.typeName;
        const widgetClasses = this.widgets.getDisplaysOfType(
          typeName,
          identifier
        );
        if (!widgetClasses.length) {
          throw new Error(`Unable to find widget of type :  ${type}`);
        }
        const widget = new widgetClasses[0](name, node, { content });

        node.addCustomWidget(widget);
      });
    }
    next();
  }
}
