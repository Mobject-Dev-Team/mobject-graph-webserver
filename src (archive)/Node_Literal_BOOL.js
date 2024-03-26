// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class Node_Literal_BOOL extends NodeBase {

    constructor() {
        super("Literal_BOOL");
        this.addProperty("value", false, "BOOL", { suppressInput: true });
        this.addOutput("out", "BOOL");
    };
};
