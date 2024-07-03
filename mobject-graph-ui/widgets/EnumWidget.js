import { DisplayWidget, ControlWidget } from "../widget.js";
import { ComboboxComponent } from "../components/ComboboxComponent.js";
import { SingleLineTextDisplayComponent } from "../components/SingleLineTextDisplayComponent.js";
import { ColorGenerator } from "../utils/ColorGenerator.js";

export class EnumDisplayWidget extends DisplayWidget {
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

export class EnumControlWidget extends ControlWidget {
  constructor(name, parent, options) {
    super(name, parent, options);

    const defaultValue = options?.parameter?.defaultValue || "";
    const enumerations = options?.parameter?.datatype?.enumerations || [];
    const type = options?.parameter?.datatype?.typeName || "";
    const colorPallet = new ColorGenerator(type);

    this.comboboxComponent = new ComboboxComponent(
      name,
      defaultValue,
      enumerations,
      colorPallet
    );

    this.comboboxComponent.on("onChange", (selection) => {
      this.setValue(selection);
    });
  }

  computeSize() {
    return this.comboboxComponent.computeSize();
  }

  mouse(event, pos, node) {
    this.comboboxComponent.onMouse(event, pos);
  }

  draw(ctx, node, widget_width, y, H) {
    this.comboboxComponent.draw(ctx, node, widget_width, y, H);
  }
}
