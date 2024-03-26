// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
class DefaultInputPortFactory {

    CreateFromBlueprint(inputPortBlueprint) {

        return function (node) {

            node.addInput(inputPortBlueprint.name, inputPortBlueprint.datatype);

        }

    }
}
