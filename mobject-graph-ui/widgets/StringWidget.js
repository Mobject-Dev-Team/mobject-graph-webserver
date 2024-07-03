import { DisplayWidget, ControlWidget } from "../widget.js";
import { SingleLineTextDisplayComponent } from "../components/SingleLineTextDisplayComponent.js";
import { SingleLineTextInputComponent } from "../components/SingleLineTextInputComponent.js";
import { ColorGenerator } from "../utils/ColorGenerator.js";

export class StringDisplayWidget extends DisplayWidget {
  constructor(name, parent, options) {
    super(name, parent, options);

    const defaultValue = options?.content?.defaultValue || "";
    const type = options?.content?.datatype?.typeName || "";
    const colorPallet = new ColorGenerator(type);

    this.textDisplayComponent = new SingleLineTextDisplayComponent(
      name,
      defaultValue,
      colorPallet
    );
  }

  onContentUpdate(value) {
    this.textDisplayComponent.text = value;
  }

  computeSize() {
    return this.textDisplayComponent.computeSize();
  }

  draw(ctx, node, widget_width, y, H) {
    this.textDisplayComponent.draw(ctx, node, widget_width, y, H);
  }
}

export class StringControlWidget extends ControlWidget {
  constructor(name, parent, options) {
    super(name, parent, options);

    const defaultValue = options?.parameter?.defaultValue || "";
    const type = options?.parameter?.datatype?.typeName || "";
    const colorPallet = new ColorGenerator(type);

    this.textInputComponent = new SingleLineTextInputComponent(
      name,
      defaultValue,
      colorPallet
    );

    this.textInputComponent.on("onChange", (text) => {
      this.setValue(text);
    });
  }

  computeSize() {
    return this.textInputComponent.computeSize();
  }

  mouse(event, pos, node) {
    this.textInputComponent.onMouse(event, pos);
  }

  draw(ctx, node, widget_width, y, H) {
    this.textInputComponent.draw(ctx, node, widget_width, y, H);
  }
}
