var kinveyMarket;

// Check if jQuery exists, and if it does then trigger the initial data load
if (typeof window.jQuery == 'undefined') {
    console.log('No jQuery defined in window. Refusing to load market.');
} else {
    window.jQuery(function() {
        // require app main controller
        kinveyMarket = require('./app/js/MainController');

        // will start the app
        kinveyMarket.startApp();
    });
}