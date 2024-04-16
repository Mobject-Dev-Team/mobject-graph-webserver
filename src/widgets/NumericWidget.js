class NumericWidgetDrawer {
  constructor(label, precision) {
    this.label = label;
    this.labelFont = "12px Arial";
    this.labelTextColor = "#999";
    this.valueFont = "12px Arial";
    this.valueTextColor = "#ddd";
    this.margin = 20;
    this.outlineColor = "#666";
    this.backgroundColor = "#222";
    this.arrowColor = "#ddd";
    this.precision = 1;
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
    ctx.roundRect(this.margin, y, drawWidth, H, H * 0.5);
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
    this.value = content.defaultValue;
    this.drawer = new NumericWidgetDrawer(name);
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

class NumericParameter {
  // Helper function to extract a metadata value or use a fallback from the parameter type
  static getMetadataOrDefault(metadata, name, fallbackProperty) {
    const item = metadata.find((m) => m.name === name);
    return item ? item.value : fallbackProperty;
  }

  // Sets up the NumberLimiter using metadata and type constraints
  static setupNumberLimiter(parameter) {
    const metadata = parameter.metadata || [];
    const type = parameter.type || {};

    // Use the helper function to get max and min values, with type bounds as fallbacks
    const max = NumericParameter.getMetadataOrDefault(
      metadata,
      "maximumValue",
      type.upperBound || 0
    );
    const min = NumericParameter.getMetadataOrDefault(
      metadata,
      "minimumValue",
      type.lowerBound || 0
    );

    // Extract boolean flags from metadata for odd/even constraints
    const onlyOdd = !!NumericParameter.getMetadataOrDefault(
      metadata,
      "onlyOdd",
      false
    );
    const onlyEven = !!NumericParameter.getMetadataOrDefault(
      metadata,
      "onlyEven",
      false
    );

    // Determine the number constraint based on metadata flags
    let constraint = null;
    if (onlyOdd) {
      constraint = "odd";
    } else if (onlyEven) {
      constraint = "even";
    }

    // Create and return the NumberLimiter with calculated properties
    return new NumberLimiter(min, max, parameter.defaultValue, constraint);
  }
}

class NumberLimiter {
  constructor(minimum, maximum, initialValue, numberType = null) {
    this.minimum = minimum;
    this.maximum = maximum;
    this.value = initialValue;
    this.numberType = numberType;

    this.initLimits();
    this.setValue(this.value);
  }

  // Check if a number needs to be adjusted to meet the odd/even requirement
  shouldAdjust(number) {
    if (this.numberType === "odd" && number % 2 === 0) {
      return true; // Needs to be odd, but is even
    }
    if (this.numberType === "even" && number % 2 !== 0) {
      return true; // Needs to be even, but is odd
    }
    return false; // No adjustment needed if numberType is null or doesn't match
  }

  // Adjusts the minimum or maximum limit to fit the odd or even requirements
  adjustLimit(limit, adjustment) {
    return this.shouldAdjust(limit) ? limit + adjustment : limit;
  }

  // Initialize limitMinimum and limitMaximum based on the current settings
  initLimits() {
    this.limitMinimum = this.adjustLimit(this.minimum, 1);
    this.limitMaximum = this.adjustLimit(this.maximum, -1);
  }

  // Public method to set the value while ensuring it meets all constraints
  setValue(newValue) {
    if (this.shouldAdjust(newValue)) {
      newValue += 1; // Adjust by 1 to make it meet the odd/even requirement
    }
    this.value = Math.min(
      Math.max(newValue, this.limitMinimum),
      this.limitMaximum
    );
  }

  // Increment the value by a certain amount and apply all adjustments and constraints
  incrementBy(amount) {
    this.setValue(this.value + amount);
  }

  // Decrement the value by a certain amount and apply all adjustments and constraints
  decrementBy(amount) {
    this.setValue(this.value - amount);
  }

  // Get the current value
  getValue() {
    return this.value;
  }
}

class NumericControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    console.log(parameter);
    super(name, property, parameter, content);
    this.drawer = new NumericWidgetDrawer(name);
    this.step = 0.1; // Define the step size for value increment
    this.isDragging = false;
    this.startX = 0;

    // Setup NumberLimiter with initial value and constraints
    this.limiter = NumericParameter.setupNumberLimiter(parameter);
    this.userValue = this.limiter.getValue(); // Cached value during dragging
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.limiter.setValue(newValue);
    this.userValue = this.limiter.getValue();
    super.notifyChange(this.userValue);
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  onMouse(event, pos, node) {
    const x = pos[0];
    const widgetWidth = node.size[0];

    // Determine the multiplier
    let multiplier = 1;
    if (event.shiftKey && event.ctrlKey) {
      multiplier = 100; // Both Shift and Ctrl pressed
    } else if (event.shiftKey) {
      multiplier = 10; // Only Shift pressed
    }

    switch (event.type) {
      case "mousedown":
        this.isDragging = false; // Assume not dragging initially
        this.startX = x;
        this.startValue = this.limiter.getValue(); // Save the initial value

        // Check x position to decide action
        if (x < 40) {
          this.limiter.decrementBy(this.step * multiplier); // Decrement by the step size with multiplier
          this.userValue = this.limiter.getValue();
        } else if (x > widgetWidth - 40) {
          this.limiter.incrementBy(this.step * multiplier); // Increment by the step size with multiplier
          this.userValue = this.limiter.getValue();
        }
        break;
      case "mousemove":
        // Check if the mouse has moved significantly
        this.isDragging = true;
        this.handleMouseMove(x, multiplier); // Handle mouse move normally

        break;
      case "mouseup":
        if (!this.isDragging && x > 40 && x < widgetWidth - 40) {
          let widget = this;

          event.target.data.prompt(
            "Value",
            this.userValue,
            function (v) {
              const value = Number(v);

              widget.limiter.setValue(value);
              widget.userValue = widget.limiter.getValue();
              widget.updateValueOnRelease();
            },
            event
          );
        }
        this.isDragging = false;
        this.updateValueOnRelease();
        break;
    }
    return true;
  }

  handleMouseMove(currentX, multiplier) {
    const deltaX = currentX - this.startX;
    const stepCount = Math.floor(deltaX / 1); // Adjust delta to a step increment
    if (stepCount !== 0) {
      this.startX = currentX;
      this.limiter.incrementBy(stepCount * this.step * multiplier); // Adjust the value based on the multiplier
      this.userValue = this.limiter.getValue(); // Update dragged value from limiter
    }
  }

  updateValueOnRelease() {
    this.limiter.setValue(this.userValue); // Ensure the limiter is updated
    this.notifyChange(this.limiter.getValue());
  }

  promptForValue(event) {
    console.log("prompt will open here");
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.drawControl(ctx, node, widget_width, y, H, this.userValue); // Use the dragged value for rendering
  }
}
