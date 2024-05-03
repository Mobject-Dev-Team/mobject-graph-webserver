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

class BooleanDisplayWidget extends DisplayWidgetBase {
  constructor(name, content) {
    super(name, content);
    this.led = new LedComponent(
      name,
      content.defaultValue,
      new ColorGenerator(content.datatype.typeName)
    );
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.led.isActive = newValue;
  }

  computeSize() {
    return this.led.computeSize();
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.led.draw(ctx, node, widget_width, y, H);
  }
}

class BooleanControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this.checkbox = new CheckboxComponent(
      name,
      parameter.defaultValue,
      new ColorGenerator(parameter.datatype.typeName)
    );
    this.checkbox.on("onChange", (isChecked) => super.notifyChange(isChecked));
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.checkbox.isChecked = newValue;
  }

  computeSize() {
    return this.checkbox.computeSize();
  }

  onMouse(event, pos, node) {
    this.checkbox.onMouse(event, pos);
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.checkbox.draw(ctx, node, widget_width, y, H);
  }
}
