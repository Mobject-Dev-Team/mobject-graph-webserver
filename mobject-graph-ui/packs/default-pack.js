import { PreExecutionCheckExtension } from "../extensions/pre-execution-check-extension.js";
import { GraphFramework } from "../graph-framework.js";
import { IecDatatypesPack } from "../packs/iec-datatypes-pack.js";

const preExecutionCheckExtension = new PreExecutionCheckExtension("precheck");

export class DefaultPack {
  static install(graphFramework = new GraphFramework(), options) {
    this.registerIncludedPacks(graphFramework, options);
    this.registerWidgets(graphFramework, options);
    this.registerExtensions(graphFramework, options);
  }

  static registerIncludedPacks(graphFramework, options = {}) {
    // add any default packs here

    // iec datatypes are switchable by the options
    if (!options.excludeIecDatatypes) {
      graphFramework.install(IecDatatypesPack);
    }
  }

  static registerWidgets(graphFramework, options = {}) {
    // add any default widgets here
  }

  static registerExtensions(graphFramework, options = {}) {
    // add any default extensions here
    graphFramework.registerExtension(preExecutionCheckExtension);
  }
}
