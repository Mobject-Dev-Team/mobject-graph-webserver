/**
 * This file defines two widget classes for use with IEC61131-3 numeric data types:
 *
 * 1. NumericControlWidget: This editable widget can be used to control numeric values.
 *    It supports various interactions for setting and adjusting values:
 *    - Click the displayed number to manually enter a value using the keyboard.
 *    - Click and drag the displayed number to increment or decrement the value.
 *      Holding the 'Shift' key while dragging will apply a 10x multiplier to the value changes.
 *      Holding both 'Shift' and 'Alt' keys will apply a 100x multiplier.
 *    - Use the arrow keys to increment or decrement the value in small steps.
 *    It also supports additional metadata options to customize its behavior:
 *    - minimumValue: Specifies a minimum value for the widget; if not provided, the data type's minimum value is used.
 *    - maximumValue: Specifies a maximum value for the widget; if not provided, the data type's maximum value is used.
 *    - onlyOdd: A boolean that, when set to true, restricts input to odd numbers only.
 *    - onlyEven: A boolean that, when set to true, restricts input to even numbers only.
 *    - precision: An integer specifying the number of decimal places for float values (e.g., REAL data type),
 *      where 1 represents 1 decimal place.
 *
 * 2. NumericDisplayWidget: This read-only widget is used to display numeric values.
 *    It supports additional metadata options to customize its behavior:
 *    - precision: An integer specifying the number of decimal places for float values (e.g., REAL data type),
 *
 * Both widgets can be registered for specific numeric data types using the graphFramework as follows:
 * graphFramework.registerWidgetType(NumericControlWidget, "INT");
 * graphFramework.registerWidgetType(NumericDisplayWidget, "INT");
 *
 * Example usage and registration demonstrate how these widgets can be integrated with numeric data types
 * such as INT (integer) to enhance user interface interactions within the graphFramework.
 */

class NumericDisplayWidget extends DisplayWidgetBase {
  constructor(name, content) {
    super(name, content);
    this.numericContent = new NumericContent(content);
    this.numericDisplay = new NumericDisplayComponent(
      name,
      this.numericContent.defaultValue,
      this.numericContent.precision,
      new ColorGenerator(content.datatype.typeName)
    );
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.numericDisplay.value = newValue;
  }

  computeSize() {
    return this.numericDisplay.computeSize();
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.numericDisplay.draw(ctx, node, widget_width, y, H);
  }
}

class NumericControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this.numericParameter = new NumericParameter(parameter);
    this.numericInput = new NumericInputComponent(
      name,
      this.numericParameter.defaultValue,
      this.numericParameter.precision,
      this.numericParameter.getNumberLimiter(),
      new ColorGenerator(parameter.datatype.typeName)
    );

    this.numericInput.on("onChange", (value) => super.notifyChange(value));
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.numericInput.value = newValue;
  }

  computeSize() {
    return this.numericInput.computeSize();
  }

  onMouse(event, pos, node) {
    this.numericInput.onMouse(event, pos, node);
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.numericInput.draw(ctx, node, widget_width, y, H);
  }
}
