import { DisplayWidget, ControlWidget } from "../widget.js";
import { deepEqual } from "../utils/DeepEqual.js";
import { loadITcVnImageToImg } from "../utils/ITcVnImageConversion.js";
import { bytesToBase64 } from "../utils/Base64.js";

export class ITcVnImageDisplayWidget extends DisplayWidget {
  constructor(name, parent, options) {
    super(name, parent, options);
    this.image = new Image();
    this.previousValue = null;
  }

  onContentUpdate(value) {
    if (deepEqual(value, this.previousValue)) return;
    loadITcVnImageToImg(this.image, value);
    this.previousValue = value;
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
  static SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/bmp"];
  static DEFAULT_SIZE = new Float32Array([100, 100]);
  static OUTLINE_COLOR = "#000"; // default outline color
  static BACKGROUND_COLOR = "#303030";
  static TEXT_COLOR = "#FFF";

  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this._url = null;
    this._img = null;
    this._size = ITcVnImageControlWidget.DEFAULT_SIZE;
    this._offscreenCanvas = null;
    this.setDefaultValue(this.getDefaultImageData());
  }

  onDisplayValueChanged(newValue, oldValue) {
    console.log(newValue);
  }

  computeSize(width) {
    return this._size;
  }

  mouse(event, pos, node) {
    // Mouse interaction handling
  }

  draw(ctx, node, widget_width, y, H) {
    const margin = 5;
    const drawWidth = widget_width - 2 * margin;
    const drawHeight = node.size[1] - margin - y;

    this.drawBackground(ctx, margin, y, drawWidth, drawHeight);
    this.drawOutline(ctx, margin, y, drawWidth, drawHeight);
    this.drawImageOrPlaceholder(
      ctx,
      margin,
      widget_width,
      y,
      drawWidth,
      drawHeight
    );
  }

  onDropFile(file) {
    if (!this.isSupportedFileType(file)) {
      console.error("Unsupported file type:", file.type);
      return false;
    }

    if (this._url) URL.revokeObjectURL(this._url);
    this._url = URL.createObjectURL(file);
    this.loadImage(this._url);
    return true;
  }

  isSupportedFileType(file) {
    return ITcVnImageControlWidget.SUPPORTED_TYPES.includes(file.type);
  }

  loadImage(url) {
    const img = new Image();
    img.src = url;
    img.onload = this.handleImageLoad.bind(this, img);
    img.onerror = () => console.error(`Error loading the image: ${url}`);
  }

  handleImageLoad(img) {
    const [newWidth, newHeight] = this.calculateNewDimensions(img);
    this._size = new Float32Array([newWidth, newHeight]);
    this.setupOffscreenCanvas(img);
    this.setValue(this.serializeOffscreenCanvas());
    this.triggerParentResetSize();
  }

  calculateNewDimensions(img) {
    let originalWidth = img.width;
    let originalHeight = img.height;
    let newHeight = 300;
    let aspectRatio = originalWidth / originalHeight;
    let newWidth = newHeight * aspectRatio;
    return [newWidth, newHeight];
  }

  setupOffscreenCanvas(img) {
    this._offscreenCanvas = new OffscreenCanvas(img.width, img.height);
    const ctx = this._offscreenCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }

  serializeOffscreenCanvas() {
    const ctx = this._offscreenCanvas.getContext("2d");
    const imageData = ctx.getImageData(
      0,
      0,
      this._offscreenCanvas.width,
      this._offscreenCanvas.height
    );

    const image = {
      imageInfo: {
        nImageSize: imageData.data.length,
        nWidth: this._offscreenCanvas.width,
        nHeight: this._offscreenCanvas.height,
        nXPadding: 0,
        nYPadding: 0,
        stPixelFormat: {
          bSupported: true,
          bSigned: false,
          bPlanar: false,
          bFloat: false,
          nChannels: 4,
          ePixelEncoding: "TCVN_PE_NONE",
          ePixelPackMode: "TCVN_PPM_NONE",
          nElementSize: 8,
          nTotalSize: 24,
        },
      },
      imageData: bytesToBase64(imageData.data),
    };

    // console.log("Serialized Image Data:", image);
    return image;
  }

  drawBackground(ctx, margin, y, width, height) {
    ctx.fillStyle = ITcVnImageControlWidget.BACKGROUND_COLOR;
    ctx.fillRect(margin, y, width, height);
  }

  drawOutline(ctx, margin, y, width, height) {
    ctx.strokeStyle = ITcVnImageControlWidget.OUTLINE_COLOR;
    ctx.strokeRect(margin, y, width, height);
  }

  drawImageOrPlaceholder(ctx, margin, widgetWidth, y, width, height) {
    if (this._offscreenCanvas) {
      ctx.drawImage(this._offscreenCanvas, margin, y, width, height);
    } else {
      ctx.textAlign = "center";
      ctx.fillStyle = ITcVnImageControlWidget.TEXT_COLOR;
      ctx.font = "italic 10pt Sans-serif";
      ctx.fillText("Drag image here...", widgetWidth * 0.5, y + height * 0.5);
    }
  }

  getDefaultImageData() {
    const image = {
      imageInfo: {
        nImageSize: 0,
        nWidth: 0,
        nHeight: 0,
        nXPadding: 0,
        nYPadding: 0,
        stPixelFormat: {
          bSupported: true,
          bSigned: false,
          bPlanar: false,
          bFloat: false,
          nChannels: 4,
          ePixelEncoding: "TCVN_PE_NONE",
          ePixelPackMode: "TCVN_PPM_NONE",
          nElementSize: 0,
          nTotalSize: 0,
        },
      },
      imageData: "",
    };
    return image;
  }
}

/* Example of data
---------------------------
{
    imageInfo: {
        nImageSize: 75,
        nWidth: 5,
        nHeight: 5,
        nXPadding: 0,
        nYPadding: 0,
        stPixelFormat: {
            bSupported: true,
            bSigned: false,
            bPlanar: false,
            bFloat: false,
            nChannels: 3,
            ePixelEncoding: "TCVN_PE_NONE",
            ePixelPackMode: "TCVN_PPM_NONE",
            nElementSize: 8,
            nTotalSize: 24,
        },
    },
    imageData:
        "7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk",
};
*/
