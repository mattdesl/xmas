/*globals google*/
var Promise = require('bluebird')

module.exports = function(latlng) {
    return new Promise(function(resolve, reject) {
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({
            latLng: new google.maps.LatLng(latlng[0], latlng[1])
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                resolve(results)
            } else {
                reject('could not geocode '+status)
            }
        });
    })
}