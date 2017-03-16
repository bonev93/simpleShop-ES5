/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var kinveyMarket;

	// Check if jQuery exists, and if it does then trigger the initial data load
	if (typeof window.jQuery == 'undefined') {
	    console.log('No jQuery defined in window. Refusing to load market.');
	} else {
	    window.jQuery(function() {
	        // require app main controller
	        kinveyMarket = __webpack_require__(1);

	        // will start the app
	        kinveyMarket.startApp();
	    });
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    startApp: function() {
	        // include Config
	        var _Config = __webpack_require__(2);
	        // include layout controller
	        var _LayoutController = __webpack_require__(3);
	        // include user controller
	        var _UserController = __webpack_require__(4);
	        // include cart controller
	        var _CartController = __webpack_require__(5);
	        // include ajax controller
	        var _AjaxController = __webpack_require__(6);

	        // init controllers
	        var Config = new _Config();
	        var LayoutController = new _LayoutController();
	        var AjaxController = new _AjaxController(LayoutController);
	        var UserController = new _UserController(Config, LayoutController, AjaxController);
	        var CartController = new _CartController(Config, LayoutController, AjaxController);

	    }
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 *
	 * @constructor
	 */
	var _Config = function ()
	{
	    this.kinveyBaseUrl = 'https://baas.kinvey.com/';
	    this.kinveyAppKey = 'kid_HJWWCNuNg';
	    this.kinveyAppSecret = 'f8de3ea9b40c46d39ccb2d77fc922ac7';
	    this.kinveyAppAuthHeaders = {
	        'Authorization': 'Basic ' + btoa(this.kinveyAppKey + ":" + this.kinveyAppSecret),
	        "Content-type": 'application/json'
	    };
	};

	_Config.prototype.getKinveyUserAuthHeaders = function() {
	    return {
	        'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken'),
	        "Content-type": 'application/json'
	    }
	};

	module.exports = _Config;


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

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






/***/ },
/* 5 */
/***/ function(module, exports) {

	var _CartController;

	var _config;
	var _layout;
	var _ajax;
	var _self;

	/**
	 * Cart controller
	 *
	 * @param config
	 * @param layout
	 * @param ajax
	 * @private
	 */
	_CartController = function(config, layout, ajax) {
	    _config = config;
	    _layout = layout;
	    _ajax = ajax;
	    _self = this;
	    this.attachEvents();
	};

	_CartController.prototype.getItemsInCart = function () {
	    let request = {
	        method: "GET",
	        url: _config.kinveyBaseUrl + 'user/' + _config.kinveyAppKey + `/${sessionStorage.getItem('id')}`,
	        headers: _config.getKinveyUserAuthHeaders(),
	        success:function (data) {
	            _self.basket = data
	        },
	        error:_ajax.ajaxError
	    };
	    $.ajax(request);
	}

	_CartController.prototype.loadProducts = function() {
	    _layout.showView('viewShop');
	    $.ajax({
	        method: "GET",
	        url: _config.kinveyBaseUrl + "appdata/" + _config.kinveyAppKey + "/products",
	        headers: _config.getKinveyUserAuthHeaders(),
	        success: _self.listProducts.bind(_self),
	        error: _ajax.ajaxError
	    });
	};

	_CartController.prototype.listProducts = function (data) {
	    let table = $('#shopProducts').find('table');
	    table.empty();
	    for (let product of data) {
	        let tr = $('<tr>').append(
	            $('<td>').text(product.name),
	            $('<td>').text(product.description),
	            $('<td>').text(Number(product.price).toFixed(2)),
	            $('<td>').append($('<button>').text('Purchase').click(_self.purchaseItem)),
	            $('<td style="display:none">').text(product._id)
	        )
	        table.append(tr)
	    }
	};

	_CartController.prototype.purchaseItem = function () {
	    let info = Array.from($(this).parent().parent().find('td'));
	    let name = $(info[0]).text();
	    let desc = $(info[1]).text();
	    let price = Number($(info[2]).text());
	    let itemId = $(info[4]).text();
	      _self.itemData = {
	        id: itemId,
	        name: name,
	        desc: desc,
	        price: price
	    };
	      _self.postTheItem();
	};

	_CartController.prototype.postTheItem = function () {
	    let itemData = _self.itemData;
	    let basket = _self.basket;
	    if (basket.cart === undefined) {
	        basket.cart = {};

	    }
	    if (basket.cart[itemData.id] == undefined) {
	        basket.cart[itemData.id] = {
	            quantity: 1,
	            product: {
	                name: itemData.name,
	                description: itemData.desc,
	                price: itemData.price
	            }
	        }
	    } else {
	        basket.cart[itemData.id].quantity += 1;
	    }

	    $.ajax({
	        method: 'PUT',
	        url: _config.kinveyBaseUrl + 'user/' + _config.kinveyAppKey + '/' + `${sessionStorage.getItem('id')}`,
	        headers: _config.getKinveyUserAuthHeaders(),
	        data: JSON.stringify(basket)
	    })
	        .then(this.listCartItems.bind(this))
	        .catch(_ajax.ajaxError);
	};

	_CartController.prototype.listCartItems = function() {
	    let table = $('#viewCart').find('table');
	    table.find('tbody').empty();
	    let data = _self.basket;
	    // console.log("testing again")
	    // console.log(typeof data)
	    // console.log(data.cart)
	    // console.log(JSON.stringify(data))
	    for (let key in data.cart) {
	        // console.log(data.cart[key].product.name)
	        // console.log(data.cart[key].product.description)
	        // console.log(data.cart[key].product.price)
	        // console.log(data.cart[key].quantity)
	        let tr = $(`<tr id=${key}>`).append(
	            $('<td>').text(data.cart[key].product.name),
	            $('<td>').text(data.cart[key].product.description),
	            $('<td>').text(data.cart[key].quantity),
	            $('<td>').text(Number(data.cart[key].product.price * data.cart[key].quantity).toFixed(2)),
	            $('<td>').append($('<button class="delete">').text('Discard').click(_self.deleteItem))
	        );
	        table.append(tr);
	    }
	    _layout.showView('viewCart');
	}

	_CartController.prototype.deleteItem = function (){
	    let key = $(this).parent().parent().attr('id');
	    delete _self.basket.cart[key];
	    $.ajax({
	        method: 'PUT',
	        url: _config.kinveyBaseUrl + 'user/' + _config.kinveyAppKey + '/' + `${sessionStorage.getItem('id')}`,
	        headers: _config.getKinveyUserAuthHeaders(),
	        data: JSON.stringify(_self.basket)
	    })
	        .then(_self.listCartItems.bind(_self))
	        .catch(_ajax.ajaxError)
	}

	_CartController.prototype.attachEvents = function () {
	    $('#linkMenuShop,#linkUserHomeShop').click(_self.loadProducts.bind(_self));
	    $('#linkMenuCart,#linkUserHomeCart').click(_self.listCartItems.bind(_self));
	    $(document).on('userLogged',function () {
	        _self.getItemsInCart();
	    });
	    // needed in case user decides to refresh when logged in
	    if(sessionStorage.getItem('id')){
	        _self.getItemsInCart();
	    }
	};

	module.exports = _CartController;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var _AjaxController;

	var _layout;

	/**
	 *
	 * @param layout
	 * @private
	 */
	_AjaxController = function(layout) {
	    _layout = layout;

	   // this.ajaxError();
	    this.attachEvents();
	};

	_AjaxController.prototype.ajaxError = function (response) {
	    let errorMsg = JSON.stringify(response);
	    if (response.readyState === 0) {
	        errorMsg = "Cannot connect due to network error.";
	    }
	    if (response.responseJSON && response.responseJSON.description) {
	        errorMsg = response.responseJSON.description;
	        _layout.showError(errorMsg);
	    }
	};

	_AjaxController.prototype.attachEvents = function() {
	    $('#infoBox, #errorBox').click(function () {
	        setInterval(function () {
	            $(this).fadeOut();
	        }, 1000)
	    });
	    $(document).on({
	        ajaxStart: function () {
	            $('#loadingBox').show();
	        },
	        ajaxStop: function () {
	            $('#loadingBox').hide();
	        }
	    })
	};

	module.exports = _AjaxController;

/***/ }
/******/ ]);