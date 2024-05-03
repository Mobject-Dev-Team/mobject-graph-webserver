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

class NumericInputComponent {
  constructor(label, precision, colorGenerator) {
    this.label = label;
    this.precision = precision;
    this.colorGenerator = colorGenerator;

    this.margin = 20;
    this.labelFont = "12px Arial";
    this.valueFont = "12px Arial";

    this.labelTextColor = this.colorGenerator.getLabelColor();
    this.valueTextColor = this.colorGenerator.getValueColor();
    this.outlineColor = this.colorGenerator.getBorderColor();
    this.backgroundColor = this.colorGenerator.getBackgroundColor();
    this.arrowColor = this.colorGenerator.getValueColor();
  }

  drawControl(ctx, node, widget_width, y, H, value) {
    ctx.textAlign = "left";
    const drawWidth = widget_width - this.margin * 2;
    this.drawBackground(ctx, y, drawWidth, H);
    this.drawLeftArrow(ctx, y, H);
    this.drawRightArrow(ctx, y, widget_width, H);
    this.drawLabel(ctx, y, H);
    this.drawValue(ctx, value, drawWidth, y, H);
  }

  drawDisplay(ctx, node, widget_width, y, H, value) {
    ctx.textAlign = "left";
    const drawWidth = widget_width - this.margin * 2;
    this.drawBackground(ctx, y, drawWidth, H);
    this.drawLabel(ctx, y, H);
    this.drawValue(ctx, value, drawWidth, y, H);
  }

  drawBackground(ctx, y, drawWidth, H) {
    ctx.strokeStyle = this.outlineColor;
    ctx.fillStyle = this.backgroundColor;
    ctx.beginPath();
    ctx.roundRect(this.margin, y, drawWidth, H, 2);
    ctx.fill();
    ctx.stroke();
  }

  drawLeftArrow(ctx, y, H) {
    ctx.fillStyle = this.arrowColor;
    ctx.beginPath();
    ctx.moveTo(this.margin + 16, y + 5);
    ctx.lineTo(this.margin + 6, y + H * 0.5);
    ctx.lineTo(this.margin + 16, y + H - 5);
    ctx.fill();
  }

  drawRightArrow(ctx, y, widget_width, H) {
    ctx.fillStyle = this.arrowColor;
    ctx.beginPath();
    ctx.moveTo(widget_width - this.margin - 16, y + 5);
    ctx.lineTo(widget_width - this.margin - 6, y + H * 0.5);
    ctx.lineTo(widget_width - this.margin - 16, y + H - 5);
    ctx.fill();
  }

  drawLabel(ctx, y, H) {
    ctx.font = this.labelFont;
    ctx.fillStyle = this.labelTextColor;
    ctx.fillText(this.label, this.margin * 2 + 5, y + H * 0.7);
  }

  drawValue(ctx, value, drawWidth, y, H) {
    ctx.font = this.valueFont;
    ctx.fillStyle = this.valueTextColor;
    ctx.textAlign = "right";
    ctx.fillText(
      Number(value).toFixed(this.precision),
      drawWidth - 20,
      y + H * 0.7
    );
  }
}

class NumericDisplayWidget extends DisplayWidgetBase {
  constructor(name, content) {
    super(name, content);
    this.numericContent = new NumericContent(content);
    this.value = this.numericContent.defaultValue;
    this.drawer = new NumericInputComponent(
      name,
      this.numericContent.precision,
      new ColorGenerator(content.datatype.typeName)
    );
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.value = newValue;
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.drawDisplay(ctx, node, widget_width, y, H, this.value);
  }
}

class NumericControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    console.log(parameter);
    super(name, property, parameter, content);
    this.setupWidget(name, parameter);
  }

  setupWidget(name, parameter) {
    this.numericParameter = new NumericParameter(parameter);
    this.drawer = new NumericInputComponent(
      name,
      this.numericParameter.precision,
      new ColorGenerator(parameter.datatype.typeName)
    );
    this.step = this.calculateStep(this.numericParameter.precision);
    this.isDragging = false;
    this.startX = 0;
    this.limiter = this.numericParameter.getNumberLimiter();
    this.userValue = this.limiter.getValue();
  }

  calculateStep(precision) {
    return Math.pow(10, -Math.abs(precision));
  }

  onDisplayValueChanged(newValue) {
    this.limiter.setValue(newValue);
    this.userValue = this.limiter.getValue();
    this.notifyChange(this.userValue);
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  onMouse(event, pos, node) {
    const x = pos[0];
    const widgetWidth = node.size[0];
    const multiplier = this.getMultiplier(event);

    if (event.type === "mousedown") {
      this.handleMouseDown(x, widgetWidth, multiplier);
    } else if (event.type === "mousemove") {
      this.handleMouseMove(x, multiplier);
    } else if (event.type === "mouseup") {
      this.handleMouseUp(x, widgetWidth, event);
    }
  }

  getMultiplier(event) {
    if (event.shiftKey && event.ctrlKey) {
      return 100;
    } else if (event.shiftKey) {
      return 10;
    } else {
      return 1;
    }
  }

  handleMouseDown(x, widgetWidth, multiplier) {
    this.isDragging = false;
    this.startX = x;
    this.adjustValueByPosition(x, widgetWidth, multiplier);
  }

  handleMouseMove(currentX, multiplier) {
    if (Math.abs(currentX - this.startX) > 1) {
      const stepCount = Math.floor(currentX - this.startX);
      this.limiter.incrementBy(stepCount * this.step * multiplier);
      this.userValue = this.limiter.getValue();
      this.startX = currentX;
      this.isDragging = true;
    }
  }

  handleMouseUp(x, widgetWidth, event) {
    if (!this.isDragging && this.isInsideInputArea(x, widgetWidth)) {
      this.promptForValue(event);
    }
    this.isDragging = false;
    this.updateValueOnRelease();
  }

  isInsideInputArea(x, widgetWidth) {
    return x > 40 && x < widgetWidth - 40;
  }

  adjustValueByPosition(x, widgetWidth, multiplier) {
    if (x < 40) {
      // down arrow
      this.limiter.decrementBy(this.step * multiplier);
    } else if (x > widgetWidth - 40) {
      // up arrow
      this.limiter.incrementBy(this.step * multiplier);
    }
    this.userValue = this.limiter.getValue();
  }

  promptForValue(event) {
    let widget = this;

    event.target.data.prompt(
      "Value",
      this.userValue.toString(),
      function (inputValue) {
        const value = Number(inputValue);
        if (!isNaN(value)) {
          widget.limiter.setValue(value);
          widget.userValue = widget.limiter.getValue();
          widget.updateValueOnRelease();
        } else {
          console.error("Invalid input: Input is not a number.");
        }
      },
      event
    );
  }

  updateValueOnRelease() {
    this.limiter.setValue(this.userValue);
    this.userValue = this.limiter.getValue();
    this.notifyChange(this.userValue);
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.drawControl(ctx, node, widget_width, y, H, this.userValue);
  }
}
