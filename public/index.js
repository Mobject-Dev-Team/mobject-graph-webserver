import { GraphFramework } from "../src/graph-framework.js";
import {
  BooleanControlWidget,
  BooleanDisplayWidget,
} from "./src/widgets/BooleanWidget.js";
import {
  NumericControlWidget,
  NumericDisplayWidget,
} from "./src/widgets/NumericWidget.js";
import {
  StringControlWidget,
  StringDisplayWidget,
} from "./src/widgets/StringWidget.js";
import {
  EnumControlWidget,
  EnumDisplayWidget,
} from "./src/widgets/EnumWidget.js";
import {
  ITcVnImageControlWidget,
  ITcVnImageDisplayWidget,
} from "./src/widgets/ITcVnImageWidget.js";
import { GraphCanvas } from "../src/graph-canvas.js";
import { PlcApi } from "../src/plc-api.js";

var graphFramework = new GraphFramework();

graphFramework.registerWidgetType(BooleanControlWidget, "BOOL");
graphFramework.registerWidgetType(BooleanDisplayWidget, "BOOL");
graphFramework.registerWidgetType(NumericControlWidget, "BYTE");
graphFramework.registerWidgetType(NumericDisplayWidget, "BYTE");
graphFramework.registerWidgetType(NumericControlWidget, "WORD");
graphFramework.registerWidgetType(NumericDisplayWidget, "WORD");
graphFramework.registerWidgetType(NumericControlWidget, "DWORD");
graphFramework.registerWidgetType(NumericDisplayWidget, "DWORD");
graphFramework.registerWidgetType(NumericControlWidget, "LWORD");
graphFramework.registerWidgetType(NumericDisplayWidget, "LWORD");
graphFramework.registerWidgetType(NumericControlWidget, "INT");
graphFramework.registerWidgetType(NumericDisplayWidget, "INT");
graphFramework.registerWidgetType(NumericControlWidget, "LINT");
graphFramework.registerWidgetType(NumericDisplayWidget, "LINT");
graphFramework.registerWidgetType(NumericControlWidget, "DINT");
graphFramework.registerWidgetType(NumericDisplayWidget, "DINT");
graphFramework.registerWidgetType(NumericControlWidget, "SINT");
graphFramework.registerWidgetType(NumericDisplayWidget, "SINT");
graphFramework.registerWidgetType(NumericControlWidget, "USINT");
graphFramework.registerWidgetType(NumericDisplayWidget, "USINT");
graphFramework.registerWidgetType(NumericControlWidget, "UINT");
graphFramework.registerWidgetType(NumericDisplayWidget, "UINT");
graphFramework.registerWidgetType(NumericControlWidget, "UDINT");
graphFramework.registerWidgetType(NumericDisplayWidget, "UDINT");
graphFramework.registerWidgetType(NumericControlWidget, "ULINT");
graphFramework.registerWidgetType(NumericDisplayWidget, "ULINT");
graphFramework.registerWidgetType(NumericControlWidget, "REAL");
graphFramework.registerWidgetType(NumericDisplayWidget, "REAL");
graphFramework.registerWidgetType(NumericControlWidget, "LREAL");
graphFramework.registerWidgetType(NumericDisplayWidget, "LREAL");
graphFramework.registerWidgetType(StringControlWidget, "STRING");
graphFramework.registerWidgetType(StringDisplayWidget, "STRING");
graphFramework.registerWidgetType(EnumControlWidget, "ENUM", "*");
graphFramework.registerWidgetType(EnumDisplayWidget, "ENUM", "*");
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

var graph = graphFramework.create();
new GraphCanvas("#mycanvas", graph);
var api = new PlcApi(graph, graphFramework);

document.getElementById("getBlueprintsBtn").addEventListener("click", () => {
  api.getBlueprints();
});
