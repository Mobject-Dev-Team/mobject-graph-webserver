class ITcVnImageDisplayWidget extends DisplayWidgetBase {
  constructor(name, content) {
    super(name, content);
    this.image = new Image();
  }

  onDisplayValueChanged(newValue, oldValue) {
    if (deepEqual(newValue, oldValue)) return;
    loadITcVnImageToImg(this.image, newValue);
  }

  computeSize() {
    return new Float32Array([60, 60]);
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.margin = 5;
    let drawWidth = widget_width - this.margin * 2 + 1;
    let drawHeight = node.size[1] - this.margin - y;

    // draw the background
    ctx.fillStyle = "#303030";
    ctx.fillRect(this.margin, y, drawWidth, drawHeight);

    // create a rectangular clipping path
    ctx.beginPath();
    ctx.rect(this.margin, y, drawWidth, drawHeight);
    ctx.clip();

    // draw the checkerboard pattern
    let blockHeight = 10;
    let blockWidth = 10;
    let nRow = drawHeight / blockHeight;
    let nCol = drawWidth / blockWidth;

    ctx.beginPath();
    for (var i = 0; i < nRow; ++i) {
      for (var j = 0, col = nCol / 2; j < col; ++j) {
        ctx.rect(
          2 * j * blockWidth + (i % 2 ? 0 : blockWidth) + this.margin,
          i * blockHeight + y,
          blockWidth,
          blockHeight
        );
      }
    }
    ctx.fillStyle = "#303030";
    ctx.fill();

    // draw the outline
    ctx.strokeStyle = this.outline_color;
    ctx.strokeRect(this.margin, y, drawWidth, drawHeight);

    // draw the no image text
    if (!this.image) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.secondary_text_color;
      ctx.font = "italic 10pt Sans-serif";
      ctx.fillText("No image", widget_width * 0.5, y + drawHeight * 0.5);

      return;
    }

    // draw the image
    ctx.drawImage(this.image, this.margin, y, drawWidth, drawHeight);
  }
}
class ITcVnImageControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
  }

  onDisplayValueChanged(newValue, oldValue) {
    console.log(newValue);
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  onMouse(event, pos, node) {}

  onDraw(ctx, node, widget_width, y, H) {}
}
