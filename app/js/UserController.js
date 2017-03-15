var _UserController;
var _config;
var _layout;
var _ajax;

/**
 * User controller
 *
 * @param config
 * @param layout
 * @param ajax
 * @private
 */
_UserController = function (config, layout, ajax) {
    _config = config;

    _layout = layout;

    _ajax = ajax;

    this.attachEvents();
};

_UserController.prototype.registerUser = function(ev) {
    ev.preventDefault();
    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=password]').val()
    }
    $.ajax({
            method: "POST",
            url: _config.kinveyBaseUrl + "user/" + _config.kinveyAppKey,
            data: JSON.stringify(userData),
            contentType: "application/json",
            headers: _config.kinveyAppAuthHeaders,
            success: this.registerUserSuccess.bind(this),
            error: _ajax.ajaxError
        }
    );
};

_UserController.prototype.registerUserSuccess = function (userInfo) {
    this.saveAuthInSession(userInfo);
    _layout.showHideMenuLinks();
    _layout.showInfo('User registration successful.');
    _layout.showView('viewUserHome');
};

_UserController.prototype.saveAuthInSession = function (userInfo) {
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('id', userInfo._id);
    $('#viewUserHomeHeading').text("Welcome, " + userInfo.username);
    //console.log(sessionStorage.getItem('authToken'))
};

_UserController.prototype.loginUser = function (ev) {
    ev.preventDefault();
    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=password]').val()
    }

    $.ajax({
            method: "POST",
            url: _config.kinveyBaseUrl + "user/" + _config.kinveyAppKey + "/login",
            data: JSON.stringify(userData),
            headers: _config.kinveyAppAuthHeaders,
            success: this.loginUserSuccess.bind(this),
            error: _ajax.ajaxError
        }
    );
};

_UserController.prototype.loginUserSuccess = function(userInfo) {
    this.saveAuthInSession(userInfo);
    _layout.showHideMenuLinks();
    _layout.showInfo('Login successful.');
    _layout.showView('viewUserHome');
    $(document).trigger('userLogged');
};

_UserController.prototype.logout = function () {
    $.ajax({
        method: 'POST',
        url: _config.kinveyBaseUrl + 'user/' + _config.kinveyAppKey + '/_logout',
        headers: _config.getKinveyUserAuthHeaders(),
        data: '',
        success: this.logoutSuccess.bind(this),
        error: _ajax.ajaxError
    })
};

_UserController.prototype.logoutSuccess = function () {
    sessionStorage.clear();
    _layout.showHideMenuLinks();
    $('#loggedInUser').text('');
    _layout.showInfo('Logout successful.');
};

_UserController.prototype.attachEvents = function () {
    $('#linkMenuLogout').click(this.logout.bind(this));
    $('#formLogin').submit(this.loginUser.bind(this));
    $('#formRegister').submit(this.registerUser.bind(this));
};

module.exports = _UserController;




