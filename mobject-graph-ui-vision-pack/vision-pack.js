import { GraphFramework } from "./graph-framework.js";

import {
  ITcVnImageControlWidget,
  ITcVnImageDisplayWidget,
} from "./widgets/ITcVnImageWidget.js";

export class VisionPack {
  static Install(graphFramework = new GraphFramework()) {
    this.RegisterWidgets(graphFramework);
  }

  static RegisterWidgets(graphFramework) {
    graphFramework.registerWidgetType(
      ITcVnImageControlWidget,
      "INTERFACE",
      "ITcVnImage"
    );
    graphFramework.registerWidgetType(
      ITcVnImageDisplayWidget,
      "INTERFACE",
      "ITcVnImage"
    );
  }
}
