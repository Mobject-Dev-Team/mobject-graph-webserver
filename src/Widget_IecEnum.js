// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="./../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.752.0/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class Widget_IecEnum extends WidgetBase {

    constructor(node, property, options) {

        // This widget accepts the following constructor arguments
        // -------------------------------------------------------
        // node - parent node
        // property - the property the widget is linked to (and shall keep updated)
        // options - shown below

        // This widget accepts the following options as an object
        // -------------------------------------------------------
        // options.iecDataType - [required] this combo box is designed to be used with iec enums, therefore must be passed this via the constructor
        // options.arrowClickHandler - accepts a function(delta, event, node) which will override the default arrow click behaviour
        // options.comboClickHandler - accepts a function(event, node) which will override the default combo click behaviour
        

        if (typeof options.iecDataType === "undefined" || options.iecDataType.type !== "ENUM") {
            console.log('you must pass the iecDataType of ENUM via options when using the Widget_IecENUM');
            return;
        }

        super(node, property, options);
        this.enumDefinitions = options.iecDataType.definition;

        if (typeof this.value === 'string') {
            this.value = this.options.iecDataType.findEnumEntryByString(this.value).value;
        }

    };

    onComputeSize(size) {

        var maxValueWidth = 0;

        Object.keys(this.enumDefinitions).forEach(key => {
            maxValueWidth = Math.max(maxValueWidth, LiteGraph.computeTextWidth(key, 0.6));
        });

        size[0] = maxValueWidth;
        size[0] += LiteGraph.computeTextWidth(this.label);
        size[0] += 70;
        size[1] = LiteGraph.NODE_WIDGET_HEIGHT;

        return size;
    };

    onDraw(ctx, node, widget_width, y, H) {
        var drawWidth = widget_width - this.margin * 2;

        // draw the outline
        ctx.strokeStyle = this.outline_color;
        ctx.fillStyle = this.background_color;
        ctx.beginPath();
        ctx.roundRect(this.margin, y, drawWidth, H, H * 0.5);
        ctx.fill();
        ctx.stroke();

        // draw the +/- triangles
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
        ctx.font = this.readOnly ? this.readOnlyValueFont : this.valueFont;
        ctx.fillStyle = this.value_color;
        ctx.textAlign = "right";
        var valueText = this.options.iecDataType.findEnumEntryByValue(this.value).name;
        ctx.fillText(valueText, drawWidth - 20, y + H * 0.7);
    };

    onComboClicked(event, node) {

        let widget = this;
        let ref_window = event.target.data.getCanvasWindow();
        let values = widget.enumDefinitions;
        let text_values = Object.keys(values);

        let menu = new LiteGraph.ContextMenu(text_values, {
            scale: 1,
            event: event,
            callback: function (v) {
                let value = widget.options.iecDataType.findEnumEntryByString(v).value;
                widget.changeValue(value, node);
            },
        }, ref_window);

    }

    onArrowClicked(delta, event, node) {

        let widget = this;
        let values = widget.enumDefinitions;
        let values_list = Object.keys(values);
        let index = -1;

        index = values_list.indexOf(this.options.iecDataType.findEnumEntryByValue(this.value).name) + delta;

        if (index >= values_list.length) {
            index = values_list.length - 1;
        }
        if (index < 0) {
            index = 0;
        }

        let value = this.options.iecDataType.findEnumEntryByString(values_list[index]).value;
        super.changeValue(value, node);

    }

    onMouse(event, pos, node) {

        var x = pos[0];
        var y = pos[1];
        var widget_width = node.size[0];

        if (event.type == "mousedown") {

            var delta = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0; // delta = -1, 1 or 0 (left arrow, right arrow or in between)

            if (delta) {

                this.last_mouseclick = 0; // avoids double click event
                this.onArrowClicked(delta, event, node)

            } else {

                this.onComboClicked(event, node);
                
            }
        }
    };

    
};
