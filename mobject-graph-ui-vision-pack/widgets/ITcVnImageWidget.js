import { DisplayWidget, ControlWidget } from "../widget.js";
import { deepEqual } from "../utils/DeepEqual.js";
import { loadITcVnImageToImg } from "../utils/ITcVnImageConversion.js";

export class ITcVnImageDisplayWidget extends DisplayWidget {
  constructor(name, parent, options) {
    super(name, parent, options);
    this.image = new Image();
  }

  onDisplayValueChanged(newValue, oldValue) {
    if (deepEqual(newValue, oldValue)) return;
    loadITcVnImageToImg(this.image, newValue);
  }

  computeSize() {
    return new Float32Array([60, 60]);
  }

  draw(ctx, node, widget_width, y, H) {
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
export class ITcVnImageControlWidget extends ControlWidget {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this._url = null;
    this._img = null;
    this._size = new Float32Array([100, 100]);
    this._offscreenCanvas = null;
  }

  onDisplayValueChanged(newValue, oldValue) {
    console.log(newValue);
  }

  computeSize(width) {
    return this._size;
  }

  mouse(event, pos, node) {}

  draw(ctx, node, widget_width, y, H) {
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
    if (!this._offscreenCanvas) {
      ctx.textAlign = "center";
      ctx.fillStyle = this.secondary_text_color;
      ctx.font = "italic 10pt Sans-serif";
      ctx.fillText("No image", widget_width * 0.5, y + drawHeight * 0.5);

      return;
    }

    // draw the image
    ctx.drawImage(this._offscreenCanvas, this.margin, y, drawWidth, drawHeight);
  }

  onDropFile(file) {
    if (!this.isSupportedFileType(file)) {
      console.error("Unsupported file type:", file.type);
      return false;
    }

    if (this._url) {
      URL.revokeObjectURL(this._url);
    }
    this._url = URL.createObjectURL(file);
    this.loadImage(this._url);
    return true;
  }

  isSupportedFileType(file) {
    const supportedTypes = ["image/jpeg", "image/png"];
    return supportedTypes.includes(file.type);
  }

  loadImage(url) {
    const img = new Image();
    img.src = url;

    img.onload = () => {
      this._img = img;
      // Assuming 'img.width' and 'img.height' are the original dimensions of the image
      let originalWidth = img.width;
      let originalHeight = img.height;

      // New height is set to 100
      let newHeight = 300;

      // Calculate the new width while maintaining the aspect ratio
      let aspectRatio = originalWidth / originalHeight;
      let newWidth = newHeight * aspectRatio;

      // Set the new size
      this._size = new Float32Array([newWidth, newHeight]);
      this._offscreenCanvas = new OffscreenCanvas(img.width, img.height);
      const ctx = this._offscreenCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      this.serializeImageData(ctx);
      this.triggerParentResetSize();
    };

    img.onerror = () => {
      console.error(`Error loading the image: ${url}`);
    };
  }

  serializeImageData(ctx) {
    const imageData = ctx.getImageData(
      0,
      0,
      this._offscreenCanvas.width,
      this._offscreenCanvas.height
    );
    const data = imageData.data;
    console.log("Serialized Image Data:", data);
  }
}
