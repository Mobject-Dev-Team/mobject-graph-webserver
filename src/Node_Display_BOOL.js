// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class Node_Display_BOOL extends NodeBase {

    constructor() {
        super("Display_BOOL");
        this.addContent("display", false, "BOOL");
        this.addInput("in", "BOOL");
    };
};
