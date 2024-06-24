export class ColorGenerator {
  LABEL_BRIGHTNESS = 70;
  LABEL_SATURATION = 0;
  VALUE_BRIGHTNESS = 90;
  VALUE_SATURATION = 0;
  BORDER_BRIGHTNESS = 50;
  BORDER_SATURATION = 0;
  BACKGROUND_BRIGHTNESS = 10;
  BACKGROUND_SATURATION = 0;
  constructor(type, other = "") {
    this.type = type;
    this.other = other;
  }

  generateHsl(saturation, brightness) {
    let hash = 0;
    for (let i = 0; i < this.type.length; i++) {
      hash = this.type.charCodeAt(i) + ((hash << 5) - hash);
    }

    for (let i = 0; i < this.other.length; i++) {
      hash = this.other.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;

    return `hsl(${hue}, ${saturation}%, ${brightness}%)`;
  }

  getLabelColor() {
    return this.generateHsl(this.LABEL_SATURATION, this.LABEL_BRIGHTNESS);
  }

  getValueColor() {
    return this.generateHsl(this.VALUE_SATURATION, this.VALUE_BRIGHTNESS);
  }

  getBorderColor() {
    return this.generateHsl(this.BORDER_SATURATION, this.BORDER_BRIGHTNESS);
  }

  getBackgroundColor() {
    return this.generateHsl(
      this.BACKGROUND_SATURATION,
      this.BACKGROUND_BRIGHTNESS
    );
  }
}
