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
import { DisplayWidget, ControlWidget } from "../widget.js";
import { NumericDisplayComponent } from "../components/NumericDisplayComponent.js";
import { NumericContent } from "../content/NumericContent.js";
import { ColorGenerator } from "../utils/ColorGenerator.js";
import { NumericInputComponent } from "../components/NumericInputComponent.js";
import { NumericParameter } from "../parameter/NumericParameter.js";

export class NumericDisplayWidget extends DisplayWidget {
  constructor(name, parent, options) {
    super(name, parent, options);

    const numericContent = new NumericContent(options.content);
    const defaultValue = numericContent.defaultValue;
    const precision = numericContent.precision;
    const type = options?.content?.datatype?.typeName || "";
    const colorPallet = new ColorGenerator(type);

    this.numericDisplayComponent = new NumericDisplayComponent(
      name,
      defaultValue,
      precision,
      colorPallet
    );
  }

  onContentUpdate(value) {
    this.numericDisplayComponent.value = value;
  }

  computeSize() {
    return this.numericDisplayComponent.computeSize();
  }

  draw(ctx, node, widget_width, y, H) {
    this.numericDisplayComponent.draw(ctx, node, widget_width, y, H);
  }
}

export class NumericControlWidget extends ControlWidget {
  constructor(name, parent, options) {
    super(name, parent, options);

    const numericParameter = new NumericParameter(options.parameter);
    const defaultValue = numericParameter.defaultValue;
    const precision = numericParameter.precision;
    const limiter = numericParameter.getNumberLimiter();
    const type = options?.parameter?.datatype?.typeName || "";
    const colorPallet = new ColorGenerator(type);

    this.numericInputComponent = new NumericInputComponent(
      name,
      defaultValue,
      precision,
      limiter,
      colorPallet
    );

    this.numericInputComponent.on("onChange", (value) => {
      this.setValue(value);
    });
  }

  computeSize() {
    return this.numericInputComponent.computeSize();
  }

  mouse(event, pos, node) {
    this.numericInputComponent.onMouse(event, pos, node);
  }

  draw(ctx, node, widget_width, y, H) {
    this.numericInputComponent.draw(ctx, node, widget_width, y, H);
  }
}
