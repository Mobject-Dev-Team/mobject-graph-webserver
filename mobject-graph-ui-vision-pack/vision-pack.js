import { GraphPack } from "./graph-pack.js";

import {
  ITcVnImageControlWidget,
  ITcVnImageDisplayWidget,
} from "./widgets/ITcVnImageWidget.js";

export class VisionPack extends GraphPack {
  registerWidgets(graphFramework) {
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
