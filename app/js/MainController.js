module.exports = {
    startApp: function() {
        // include Config
        var _Config = require('./Config');
        // include layout controller
        var _LayoutController = require('./LayoutController');
        // include user controller
        var _UserController = require('./UserController');
        // include cart controller
        var _CartController = require('./CartController');
        // include ajax controller
        var _AjaxController = require('./AjaxController');

        // init controllers
        var Config = new _Config();
        var LayoutController = new _LayoutController();
        var AjaxController = new _AjaxController(LayoutController);
        var UserController = new _UserController(Config, LayoutController, AjaxController);
        var CartController = new _CartController(Config, LayoutController, AjaxController);

    }
}
