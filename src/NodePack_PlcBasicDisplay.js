// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var NodePack_PlcBasicDisplay = (function () {

    return {

        RegisterWithGraph: function (Graph) {
            
            // Display
            Graph.registerNodeByType("PLC Basic/Display/BOOL", Node_Display_BOOL);
        }
    }
})();
