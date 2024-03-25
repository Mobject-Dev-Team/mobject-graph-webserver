// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class NodeTriggerAbility extends AbilityBase {

    constructor(node) {
        super('TriggerAbility');
        node.addInput("trigger", LiteGraph.ACTION);
        node.addOutput("result", LiteGraph.EVENT);
    };
};
