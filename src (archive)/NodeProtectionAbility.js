// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class NodeProtectionAbility extends AbilityBase {

    constructor(node) {
        super('ProtectionAbility');
        node.addHiddenProperty('protection', true, 'BOOL');
        node.registerStatusHandler(this.handleProtectionStatus);
    };

    handleProtectionStatus(status, node) {

        if (!node.properties.protection) {
            node.addStyle('protectionOff', { fgcolor: "#000075", bgcolor: "#0c0096" });
        } else {
            node.removeStyle('protectionOff');
        }
    }
};
