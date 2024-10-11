import { NodeBlueprintHandler } from "../node-blueprint-handlers.js";

export class PreExecutionCheckExtension {
  constructor(name) {
    this.name = name;
  }

  registerWithGraph(graphFramework) {
    graphFramework.nodeClassFactory.registerHandler(
      new PreExecutionCheckExtensionBlueprintHandler(this.name)
    );
  }
}

export class PreExecutionCheckExtensionBlueprintHandler extends NodeBlueprintHandler {
  constructor(name) {
    super();
    this.name = name;
  }

  handle(node, blueprint, next) {
    // console.log(blueprint);
    if (!blueprint.extensions) return;

    // Find the 'precheck' extension in the 'extensions' array
    const precheckExtension = blueprint.extensions.find(
      (extension) => extension.name === this.name
    );

    // Check if the 'precheck' extension exists
    if (!precheckExtension) {
      return;
    }

    // Check if the 'precheck' extension has the 'enable' parameter and if it is enabled
    const enableParameter = precheckExtension.parameters.find(
      (param) => param.name === "enable"
    );
    if (enableParameter && enableParameter.defaultValue === true) {
      // console.log("Precheck extension is enabled.");
    } else {
      // console.log("Precheck extension is disabled.");
    }

    // registerForContentUpdates() {
    //   if (!this.#content || !this.#parent) return;
    //   node.on("nodeStatusUpdated", (status) => {
    //     const value = status.contents?.find(
    //       (content) => content.name === this.#content.name
    //     )?.value;
    //     this.onContentUpdate(value);
    //     this.#parent?.setDirtyCanvas(true, true);
    //   });
    // }

    next();
  }
}
