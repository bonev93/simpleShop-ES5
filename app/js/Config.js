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
