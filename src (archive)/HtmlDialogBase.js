// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.5/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class HtmlDialogBase {

    constructor(html, options, callback) {
        this.value = null;
        this.dialog = null;

        if (callback) {
            this.callback = callback;
        }

        this.dialog = canvas.createDialog(html, options);
        this.dialog.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        this.dialog.addEventListener("mouseup", this.onMouseUp.bind(this));
    };

    onMouseUp(e) {
        this.close();
    };

    onMouseLeave(e) {
        this.close();
    };

    close() {
        this.dialog.close();
        delete this;
    };
};
