export var MessageDisplayerUtility = (function () {
    function MessageDisplayerUtility() {
    }

    MessageDisplayerUtility.prototype.setMessageDisplayer = function (messageDisplayer) {
        this.messageDisplayer = messageDisplayer;
    };

    // pass-through methods
    MessageDisplayerUtility.prototype.displayErrorMessage = function (message) {
        this.messageDisplayer && this.messageDisplayer.displayErrorMessage(message);
    };

    MessageDisplayerUtility.prototype.displaySuccessMessage = function (message) {
        this.messageDisplayer && this.messageDisplayer.displaySuccessMessage(message);
    };

    return MessageDisplayerUtility;
}());

