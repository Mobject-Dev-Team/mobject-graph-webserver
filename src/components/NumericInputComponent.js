class NumericInputComponent {
  constructor(label, defaultValue, precision, limiter, colorGenerator) {
    this.eventEmitter = new EventEmitter();
    this.label = label;
    this.precision = precision;
    this.limiter = limiter;
    this.colorGenerator = colorGenerator;
    this._value = defaultValue;
    this.isDragging = false;
    this.startX = 0;
    this.step = this.calculateStep(precision);
    this.setupDefaults();
  }

  setupDefaults() {
    this.labelFont = "12px Arial";
    this.valueFont = "12px Arial";
    this.margin = 20;
    this.labelTextColor = this.colorGenerator.getLabelColor();
    this.valueTextColor = this.colorGenerator.getValueColor();
    this.outlineColor = this.colorGenerator.getBorderColor();
    this.backgroundColor = this.colorGenerator.getBackgroundColor();
    this.arrowColor = this.colorGenerator.getValueColor();
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.eventEmitter.emit("onChange", this._value);
  }

  on(eventName, listener) {
    this.eventEmitter.on(eventName, listener);
  }

  off(eventName, listener) {
    this.eventEmitter.off(eventName, listener);
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

  calculateStep(precision) {
    return Math.pow(10, -Math.abs(precision));
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
    this.isMyMouseEvent = true;
    this.isDragging = false;
    this.startX = x;
    this.adjustValueByPosition(x, widgetWidth, multiplier);
  }

  handleMouseMove(currentX, multiplier) {
    if (!this.isMyMouseEvent) return;
    if (Math.abs(currentX - this.startX) > 1) {
      const stepCount = Math.floor(currentX - this.startX);
      this.limiter.incrementBy(stepCount * this.step * multiplier);
      this._value = this.limiter.getValue();
      this.startX = currentX;
      this.isDragging = true;
    }
  }

  handleMouseUp(x, widgetWidth, event) {
    if (!this.isDragging && this.isInsideInputArea(x, widgetWidth)) {
      this.promptForValue(event);
    }
    this.isDragging = false;
    this.isMyMouseEvent = false;
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
    this._value = this.limiter.getValue();
  }

  promptForValue(event) {
    let widget = this;

    event.target.data.prompt(
      "Value",
      this.value.toString(),
      function (inputValue) {
        const value = Number(inputValue);
        if (!isNaN(value)) {
          widget.limiter.setValue(value);
          widget.value = widget.limiter.getValue();
          widget.updateValueOnRelease();
        } else {
          console.error("Invalid input: Input is not a number.");
        }
      },
      event
    );
  }

  updateValueOnRelease() {
    this.limiter.setValue(this.value);
    this.value = this.limiter.getValue();
  }

  draw(ctx, node, widget_width, y, H) {
    ctx.textAlign = "left";
    const drawWidth = widget_width - this.margin * 2;
    this.drawBackground(ctx, y, drawWidth, H);
    this.drawLeftArrow(ctx, y, H);
    this.drawRightArrow(ctx, y, widget_width, H);
    this.drawLabel(ctx, y, H);
    this.drawValue(ctx, drawWidth, y, H);
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

  drawValue(ctx, drawWidth, y, H) {
    ctx.font = this.valueFont;
    ctx.fillStyle = this.valueTextColor;
    ctx.textAlign = "right";
    ctx.fillText(
      Number(this._value).toFixed(this.precision),
      drawWidth - 5,
      y + H * 0.7
    );
  }
}
