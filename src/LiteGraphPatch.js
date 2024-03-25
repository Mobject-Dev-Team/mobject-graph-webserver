// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

// monkey patching of the original litegraph.js is done here.

(function (LiteGraph) {

    // setup datatypes

    LiteGraph.iecDataTypes = {
        'BIT': iec.BIT,
        'BOOL': iec.BOOL,
        'BYTE': iec.BYTE,
        'DATE': iec.DATE,
        'DATE_AND_TIME': iec.DATE_AND_TIME,
        'DINT': iec.DINT,
        'DT': iec.DT,
        'DWORD': iec.DWORD,
        'INT': iec.INT,
        'LINT': iec.LINT,
        'LREAL': iec.LREAL,
        'LWORD': iec.LWORD,
        'PVOID': iec.PVOID,
        'REAL': iec.REAL,
        'SINT': iec.SINT,
        'STRING': iec.STRING(255),
        'TIME': iec.TIME,
        'TIME_OF_DAY': iec.TIME_OF_DAY,
        'TOD': iec.TOD,
        'UDINT': iec.UDINT,
        'UINT': iec.UINT,
        'ULINT': iec.ULINT,
        'USINT': iec.USINT,
        'WORD': iec.WORD,
    };

    LiteGraph.addIecDataType = function (dataTypeAsString) {

        try {
            let iecDataType = iec.fromString(dataTypeAsString, null, this.iecDataTypes);
            this.iecDataTypes[iecDataType.name] = iecDataType.resolved;
        }
        catch (err) {
            console.log('failed to add iec datatype', dataTypeAsString)
        }

    }

    LiteGraph.getIecDatatype = function (dataType) {
        return this.iecDataTypes[dataType];
    }

    LiteGraph.visualWidgets = new WidgetCollection(Widget_Blank);

    LiteGraph.addVisualWidgetByType = function (widget, type) {

        this.visualWidgets.addByType(widget, type);

    }

    LiteGraph.getVisualWidgetByType = function (type) {

        return this.visualWidgets.getByType(type);

    }

    LiteGraph._registerNodeType = LiteGraph.registerNodeType;
    LiteGraph.registerNodeType = function (type, base_class) {

        var pos = type.lastIndexOf("/");
        if (pos > -1) {
            base_class.title = type.substr(pos + 1, type.length);
        }

        this._registerNodeType(type, base_class);
    };


    LiteGraph.computeTextWidth = function (text, fontSize) {

        if (!text) {
            return 0;
        }

        let t = text.toString();

        if (typeof fontSize === "undefined")
            return LiteGraph.NODE_TEXT_SIZE * t.length * 0.6;

        return LiteGraph.NODE_TEXT_SIZE * t.length * fontSize;

    };

    LiteGraph.LGraphNode.prototype._addProperty = LiteGraph.LGraphNode.prototype.addProperty;

    // Added properties to prototype as we think this is a litegraph bug.
    LiteGraph.LGraphCanvas.prototype.onShowMenuNodeProperties = LiteGraph.LGraphCanvas.onShowMenuNodeProperties;
    LiteGraph.LGraphCanvas.prototype.onShowPropertyEditor = LiteGraph.LGraphCanvas.onShowPropertyEditor;

})(LiteGraph);
