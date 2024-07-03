/**
 * This file defines two widget classes for use with IEC61131-3 BOOLEAN data types:
 *
 * 1. BooleanControlWidget: This widget allows users to interactively control BOOLEAN values.
 *    - Interaction is straightforward: click the widget to toggle the boolean value between TRUE and FALSE.
 *
 * 2. BooleanDisplayWidget: This read-only widget is used to display BOOLEAN values, showing them as either TRUE or FALSE.
 *
 * Both widgets can be registered for the BOOLEAN data type using the graphFramework as follows:
 * graphFramework.registerWidgetType(BooleanControlWidget, "BOOL");
 * graphFramework.registerWidgetType(BooleanDisplayWidget, "BOOL");
 *
 * These widgets are designed to integrate seamlessly with BOOLEAN data types, offering a simple and effective user
 * interface for displaying and controlling boolean states within the graphFramework environment.
 */

import { DisplayWidget, ControlWidget } from "../widget.js";
import { LedComponent } from "../components/LedComponent.js";
import { CheckboxComponent } from "../components/CheckboxComponent.js";
import { ColorGenerator } from "../utils/ColorGenerator.js";

export class BooleanDisplayWidget extends DisplayWidget {
  constructor(name, parent, options) {
    super(name, parent, options);

    const defaultValue = options?.content?.defaultValue || false;
    const type = options?.content?.datatype?.typeName || "";
    const colorPallet = new ColorGenerator(type);

    this.ledComponent = new LedComponent(name, defaultValue, colorPallet);
  }

  onContentUpdate(value) {
    this.ledComponent.isActive = value;
  }

  computeSize() {
    return this.ledComponent.computeSize();
  }

  draw(ctx, node, widget_width, y, H) {
    this.ledComponent.draw(ctx, node, widget_width, y, H);
  }
}

export class BooleanControlWidget extends ControlWidget {
  constructor(name, parent, options) {
    super(name, parent, options);

    const defaultValue = options?.parameter?.defaultValue || false;
    const type = options?.parameter?.datatype?.typeName || "";
    const colorPallet = new ColorGenerator(type);

    this.checkboxComponent = new CheckboxComponent(
      name,
      defaultValue,
      colorPallet
    );
    this.checkboxComponent.on("onChange", (isChecked) => {
      this.setValue(isChecked);
    });
  }

  computeSize() {
    return this.checkboxComponent.computeSize();
  }

  mouse(event, pos, node) {
    this.checkboxComponent.onMouse(event, pos);
  }

  draw(ctx, node, widget_width, y, H) {
    this.checkboxComponent.draw(ctx, node, widget_width, y, H);
  }
}
