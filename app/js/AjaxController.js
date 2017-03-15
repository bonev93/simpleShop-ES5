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