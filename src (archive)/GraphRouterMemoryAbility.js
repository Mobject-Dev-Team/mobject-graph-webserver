// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class GraphRouterMemoryAbility extends AbilityBase {

    constructor(graph) {
        super('RouterMemoryAbility');
        graph.registerStatusHandler(this.handleRouterMemoryStatus);
    };

    handleRouterMemoryStatus(status, graph) {

        if (typeof status === 'undefined' || status === null) return;
        if (status.name !== 'RouterMemory') return;
        if (typeof status.data === 'undefined' || status.data === null) return;

        let data = status.data;
        let result1 = get_text(data.startMemory, data.currentMemory, data.memoryDifference);
        let result2 = get_text(data.tcStartMemory, data.currentMemory, data.tcStartMemoryDifference);

        let tb1 = TcHmi.Controls.get('tbRouterMemory');
        let tb2 = TcHmi.Controls.get('tbTcRouterMemory');

        if (typeof tb1 !== 'undefined')
            set_text(tb1, result1);

        if (typeof tb2 !== 'undefined')
            set_text(tb2, result2);

        function get_text(start, current, difference) {

            let result = { text: '', colour: null };

            result.text = result.text.concat(start, ' | ', current, ' (', difference, ')');
            result.colour = (difference < 0) ? { color: "rgba(193,18,18,1)" } : null;

            return result;
        };

        function set_text(textBox, result) {

            textBox.setText(result.text);
            textBox.setTextColor(result.colour)
        };
    };
};
