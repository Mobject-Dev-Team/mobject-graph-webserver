import { GraphFramework } from "../graph-framework.js";
import {
  BooleanControlWidget,
  BooleanDisplayWidget,
} from "../widgets/BooleanWidget.js";
import {
  NumericControlWidget,
  NumericDisplayWidget,
} from "../widgets/NumericWidget.js";
import {
  StringControlWidget,
  StringDisplayWidget,
} from "../widgets/StringWidget.js";
import { EnumControlWidget, EnumDisplayWidget } from "../widgets/EnumWidget.js";

export class IecDatatypesPack {
  static install(graphFramework = new GraphFramework()) {
    this.registerWidgets(graphFramework);
  }

  static registerWidgets(graphFramework) {
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
  }
}
