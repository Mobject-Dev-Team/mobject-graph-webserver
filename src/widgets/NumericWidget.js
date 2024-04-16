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

class NumericControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this.value = parameter.defaultValue;
    this.drawer = new NumericWidgetDrawer(name);
    this.step = 1;
    this.onlyOdd = false;
    this.onlyEven = false;
    this.limitMinimum = 0;
    this.limitMaximum = 1000;
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.value = newValue;
    super.notifyChange(this.value);
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  onMouse(event, pos, node) {
    console.log(event);
    const x = pos[0];
    const widgetWidth = node.size[0];
    switch (event.type) {
      case "mousemove":
        // this.handleMouseMove(event.deltaX);
        break;
      case "mousedown":
      case "mouseup":
        this.handleClick(x, widgetWidth, event);
        break;
    }
  }

  calculateDelta(x, widgetWidth) {
    const LEFT_MARGIN = 40;
    const RIGHT_MARGIN = widgetWidth - 40;
    return x < LEFT_MARGIN ? -1 : x > RIGHT_MARGIN ? 1 : 0;
  }

  handleClick(x, widgetWidth, event) {
    const delta = this.calculateDelta(x, widgetWidth);
    if (event.type === "mouseup" && event.click_time < 200 && delta === 0) {
      this.promptForValue(event);
    } else {
      let value = this.value + delta * this.step;
      value = this.adjustForParity(value, delta);
      this.updateValue(value);
    }
  }

  promptForValue(event) {
    console.log("prompt");
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.drawControl(ctx, node, widget_width, y, H, this.value);
  }
}
