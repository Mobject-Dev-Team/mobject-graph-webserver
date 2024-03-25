// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="./../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.752.0/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class Widget_Separator extends WidgetBase {

    constructor() {
        super();
    };

    onDraw(ctx, node, widget_width, y, H) {

        // draw the separator line
        ctx.strokeStyle = this.outline_color;
        ctx.beginPath();
        ctx.moveTo(this.margin, y + H * 0.5);
        ctx.lineTo(widget_width - this.margin, y + H * 0.5);
        ctx.stroke();
    };
};
