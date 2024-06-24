class ImageDisplayComponent {
    constructor(label) {
      this.label = label;
      this.colorGenerator = colorGenerator;
      this._image = defaultValue;
      this.setupDefaults();
    }
  
    setupDefaults() {
      this.labelFont = "12px Arial";
      this.valueFont = "12px Arial";
      this.margin = 20;
    }
  
    get image() {
      return this._value;
    }
  
    set image(image) {
      this._image = image;
    }
  
    computeSize() {
      return new Float32Array([100, 100]);
    }
  
    draw(ctx, node, widget_width, y, H) {
      ctx.textAlign = "left";
      const drawWidth = widget_width - this.margin * 2;
      this.drawLabel(ctx, y, H);
      this.drawValue(ctx, drawWidth, y, H);
    }
  }
  