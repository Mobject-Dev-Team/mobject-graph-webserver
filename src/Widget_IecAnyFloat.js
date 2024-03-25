// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="./../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.752.0/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class Widget_IecAnyFloat extends Widget_Number {

    // This widget accepts the following constructor arguments
    // -------------------------------------------------------
    // node - parent node
    // property - the property the widget is linked to (and shall keep updated)
    // options - shown below

    // This widget accepts the following options as an object
    // -------------------------------------------------------
    // options.min - user defined minimum value, if no value is given then the iec minimum will be used
    // options.max - user defined maximum value, if no value is given then the iec maximum will be used
    // options.step - how many places the widget will count up per click / move (can be used for counting in odd, even numbers)
    // options.onlyOdd - will adjust the widget to work with only odd numbers, this will automatically configure the step if needed.
    // options.onlyEven - will adjust the widget to work with only even numbers, this will automatically configure the step if needed.
    // options.precision - how many decimal places are displayed
    // options.iecDataType - this will be used if passed in, otherwise the global iecDataType will be requested

    constructor(node, property, options) {

        let _options = options || {};

        _options.iecDataType = _options.iecDataType || {};

        if (typeof _options.min === "undefined") {
            if (typeof _options.iecDataType.min !== "undefined")
                _options.min = _options.iecDataType.min;
            else
                _options.min = Number.MAX_VALUE * -1;
        }

        if (typeof _options.max === "undefined") {
            if (typeof _options.iecDataType.max !== "undefined")
                _options.max = _options.iecDataType.max;
            else
                _options.max = Number.MAX_VALUE;
        }

        super(node, property, _options);

    };

};
