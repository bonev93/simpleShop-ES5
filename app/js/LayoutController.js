/**
 * Layout controller
 *
 * @private
 */
var _LayoutController = function() {
    this.attachEvents();
    this.showHideMenuLinks();
};

_LayoutController.prototype.showHideMenuLinks = function() {
    $('#menu a').hide();
    $('#errorBox,#infoBox,#loadingBox').hide();
    if (sessionStorage.getItem('authToken')) {
        $('#linkMenuUserHome').show();
        $('#linkMenuShop').show();
        $('#linkMenuCart').show();
        $('#linkMenuLogout').show();
        $('#spanMenuLoggedInUser').text(`Welcome, ${sessionStorage.getItem('username')}`).show();
        $('#viewUserHomeHeading').text(`Welcome, ${sessionStorage.getItem('username')}`);
        this.showView('viewUserHome')
    }
    else {
        $('#linkMenuAppHome').show();
        $('#linkMenuLogin').show();
        $('#linkMenuRegister').show();
        $('#spanMenuLoggedInUser').hide();
        this.showView('viewAppHome');
    }
};

_LayoutController.prototype.showInfo = function(message) {
    $('#infoBox').text(message)
    $('#infoBox').show();
    setTimeout(function () {
        $('#infoBox').fadeOut()
    }, 3000)
};

_LayoutController.prototype.showError = function(msg) {
    $('#errorBox').text('Error: ' + msg);
    $('#errorBox').show();
    setTimeout(function () {
        $('#errorBox').fadeOut()
    }, 3000)
};

_LayoutController.prototype.showView = function(viewName) {
    $('main>section').hide();
    $('#' + viewName).show();
};

_LayoutController.prototype.showHomeView = function() {
    this.showView('viewAppHome');
};

_LayoutController.prototype.showLoginView = function() {
    this.showView('viewLogin');
    $('#formLogin').trigger('reset');
};

_LayoutController.prototype.showRegisterView = function() {
    $('#formRegister').trigger('reset');
    this.showView('viewRegister');
};

_LayoutController.prototype.showUserHome = function() {
    this.showView('viewUserHome');
};

_LayoutController.prototype.attachEvents = function() {
    $('#linkMenuAppHome').click(this.showHomeView.bind(this));
    $('#linkMenuLogin').click(this.showLoginView.bind(this));
    $('#linkMenuRegister').click(this.showRegisterView.bind(this));
    $('#linkMenuUserHome').click(this.showUserHome.bind(this));
};

module.exports = _LayoutController;
