// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

var NodePack_PlcBasic = (function () {

    return {

        RegisterWithGraph: function (Graph) {
            
            // Display
            NodePack_PlcBasicDisplay.RegisterWithGraph(Graph);

            // Literals
            NodePack_PlcBasicLiterals.RegisterWithGraph(Graph);

        }
    }
})();
