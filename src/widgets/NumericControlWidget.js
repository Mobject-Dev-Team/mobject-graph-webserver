class NumericControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);

    console.log("widget data");
    console.log(name);
    console.log(property);
    console.log(parameter);
    console.log(content);

    this.labelFont = "12px Arial";
    this.valueFont = "12px Arial";
    this.margin = 20;
    this.outline_color = "#666";
    this.background_color = "#222";
    this.text_color = "#ddd";
    this.secondary_text_color = "#999";
    this.value_color = "#ddd";
    this.secondary_value_color = "#555555";

    this.precision = 0;
    this.step = 1;

    this.minimum = 0;
    this.maximum = 100;

    this.onlyOdd = false;
    this.onlyEven = false;

    this.limitMinimum =
      (this.onlyOdd && this.minimum % 2 == 0) ||
      (this.onlyEven && !(this.minimum % 2 == 0))
        ? this.minimum + 1
        : this.minimum;
    this.limitMaximum =
      (this.onlyOdd && this.maximum % 2 == 0) ||
      (this.onlyEven && !(this.maximum % 2 == 0))
        ? this.maximum - 1
        : this.maximum;

    if (
      (this.onlyOdd && this.value % 2 == 0) ||
      (this.onlyEven && !(this.value % 2 == 0))
    ) {
      this.value += 1;
    }

    this.value = Math.min(
      Math.max(this.value, this.limitMinimum),
      this.limitMaximum
    );

    this.value = parameter.defaultValue;
  }

  onDraw(ctx, node, widget_width, y, H) {
    var drawWidth = widget_width - this.margin * 2;

    // draw the outline
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    ctx.roundRect(this.margin, y, drawWidth, H, H * 0.5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = this.text_color;
    ctx.beginPath();
    ctx.moveTo(this.margin + 16, y + 5);
    ctx.lineTo(this.margin + 6, y + H * 0.5);
    ctx.lineTo(this.margin + 16, y + H - 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(widget_width - this.margin - 16, y + 5);
    ctx.lineTo(widget_width - this.margin - 6, y + H * 0.5);
    ctx.lineTo(widget_width - this.margin - 16, y + H - 5);
    ctx.fill();

    // draw the label text
    ctx.font = this.labelFont;
    ctx.fillStyle = this.secondary_text_color;
    if (this.label != null) {
      ctx.fillText(this.label, this.margin * 2 + 5, y + H * 0.7);
    }

    // draw the value text
    ctx.font = this.valueFont;
    ctx.fillStyle = this.value_color;
    ctx.textAlign = "right";
    ctx.fillText(
      Number(this.value).toFixed(this.precision),
      drawWidth - 20,
      y + H * 0.7
    );
  }

  onMouse(event, pos, node) {
    let value = this.value;
    let x = pos[0];
    let y = pos[1];
    let widget_width = node.size[0];

    if (event.type == "mousemove") {
      let preCheckValue = value + event.deltaX * this.step;

      if (
        (this.onlyOdd && preCheckValue % 2 == 0) ||
        (this.onlyEven && !(preCheckValue % 2 == 0))
      ) {
        if (event.deltaX <= -1) preCheckValue -= 1;
        if (event.deltaX >= 1) preCheckValue += 1;
      }

      value = Math.min(
        Math.max(preCheckValue, this.limitMinimum),
        this.limitMaximum
      );

      this.value = value;
      widget.notifyChange(this.value);
    } else if (event.type == "mousedown") {
      let delta = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0; // delta = -1, 1 or 0 (left arrow, right arrow or in between)

      value += delta * this.step;

      if (
        (this.onlyOdd && value % 2 == 0) ||
        (this.onlyEven && !(value % 2 == 0))
      ) {
        if (delta == -1) value -= 1;
        if (delta == 1) value += 1;
      }

      value = Math.min(Math.max(value, this.limitMinimum), this.limitMaximum);
      this.value = value;
      widget.notifyChange(this.value);
    } else if (event.type == "mouseup") {
      let delta = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0; // delta = -1, 1 or 0 (left arrow, right arrow or in between)
      if (event.click_time < 200 && delta == 0) {
        let widget = this;

        event.target.data.prompt(
          "Value",
          value,
          function (v) {
            value = Number(v);

            if (
              (widget.onlyOdd && value % 2 == 0) ||
              (widget.onlyEven && !(value % 2 == 0))
            )
              return;

            value = Math.min(
              Math.max(value, widget.limitMinimum),
              widget.limitMaximum
            );
            this.value = value;
            widget.notifyChange(this.value);
          },
          event
        );
      }
    }
  }
}
