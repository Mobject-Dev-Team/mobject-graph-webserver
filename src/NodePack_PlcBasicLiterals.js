// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var NodePack_PlcBasicLiterals = (function () {

    return {

        RegisterWithGraph: function (Graph) {
            
            // Literals
            Graph.registerNodeByType("PLC Basic/Literals/BOOL", Node_Literal_BOOL);
        }
    }
})();
