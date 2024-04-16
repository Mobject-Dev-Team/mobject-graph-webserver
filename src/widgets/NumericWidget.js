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

class NumberLimiter {
  constructor(minimum, maximum, value, numberType = null) {
    this.minimum = minimum;
    this.maximum = maximum;
    this.value = value;
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
    super(name, property, parameter, content);
    this.value = parameter.defaultValue;
    this.drawer = new NumericWidgetDrawer(name);
    this.step = 1;
    this.isDragging = false;
    this.startX = 0;
    this.draggedValue = this.value; // Cached value during dragging
    this.limitMinimum = -100;
    this.limitMaximum = 200;
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.value = newValue;
    super.notifyChange(this.value);
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  onMouse(event, pos, node) {
    const x = pos[0];
    const widgetWidth = node.size[0];
    switch (event.type) {
      case "mousedown":
        this.isDragging = true;
        this.startX = x;
        this.draggedValue = this.value;
        break;
      case "mousemove":
        if (this.isDragging) {
          this.handleMouseMove(x);
        }
        break;
      case "mouseup":
        if (this.isDragging) {
          this.isDragging = false;
          this.updateValueOnRelease();
        }
        break;
    }
    return true;
  }

  handleMouseMove(currentX) {
    const deltaX = currentX - this.startX;
    const stepCount = Math.floor(deltaX / 1);
    if (stepCount !== 0) {
      this.startX = currentX;
      this.draggedValue += stepCount * this.step;
      this.draggedValue = Math.min(
        Math.max(this.draggedValue, this.limitMinimum),
        this.limitMaximum
      );
    }
  }

  updateValueOnRelease() {
    if (this.draggedValue !== this.value) {
      this.value = this.draggedValue;
      this.notifyChange(this.value);
    }
  }

  promptForValue(event) {
    console.log("prompt will open here");
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.drawControl(ctx, node, widget_width, y, H, this.draggedValue); // Use the dragged value for rendering
  }
}
