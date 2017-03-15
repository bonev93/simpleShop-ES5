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
    console.log("another test")
    console.log(typeof _self.basket);
    console.log(typeof this.itemData);
    console.log(JSON.stringify(this.basket))
    console.log(JSON.stringify(this.itemData))

    let itemData = _self.itemData;
    let basket = _self.basket;
    if (typeof basket.cart === undefined) {
        basket.cart = {};
        basket.cart[itemData.id] = {
            quantity: 1,
            product: {
                name: itemData.name,
                description: itemData.desc,
                price: itemData.price
            }
        }
    } else if (basket.cart[itemData.id] == undefined) {
        basket.cart[itemData.id] = {
            quantity: 1,
            product: {
                name: itemData.name,
                description: itemData.desc,
                price: itemData.price
            }
        }
    } else if (basket.cart[itemData.id] != undefined) {
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
    console.log("test789")
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
