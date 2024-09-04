import { GraphFramework } from "./graph-framework.js";

import {
  ITcVnImageControlWidget,
  ITcVnImageDisplayWidget,
} from "./widgets/ITcVnImageWidget.js";

export class VisionPack {
  static install(graphFramework = new GraphFramework()) {
    this.registerWidgets(graphFramework);
    this.registerFileAssociation(graphFramework);
  }

  static registerWidgets(graphFramework) {
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

  static registerFileAssociation(graphFramework) {
    graphFramework.registerFileAssociation(
      ["jpg", "png", "bmp"],
      "Literal/INTERFACE/ITcVnImage",
      "value"
    );
  }
}
