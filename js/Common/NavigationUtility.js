export var NavigationUtility = (function () {
    function NavigationUtility() {
    }

    NavigationUtility.prototype.setNavigator = function (navigator) {
        this.navigator = navigator;
    };

    // pass-through methods
    NavigationUtility.prototype.navigateTo = function (routeName, params) {
        this.navigator.navigateTo(routeName, params);
    };

    NavigationUtility.prototype.goBack = function () {
        this.navigator.goBack();
    };

    return NavigationUtility;
}());

