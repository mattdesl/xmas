/*globals google*/

var Promise = require('bluebird')
var nearestCoffee = require('nearest-coffee')
var geocode = require('./geocode')
var xtend = require('xtend')

//we don't want it to error out if we can't find coffee
function nearestCoffeeAsync(opt) {
    return new Promise(function(resolve, reject) {
        nearestCoffee(opt, function(err, data) {
            if (err)
                resolve([])
            else 
                resolve(data)
        })
    })
}


module.exports = function(latlng) {
    return geocode(latlng)
        .then(function(data) {
            if (data.length===0)
                return Promise.reject('could not get geocode info')

            var index = Math.max(0, data.length-3)
            return { 
                name: data[index].formatted_address,
                country: data[data.length-1].formatted_address,
                originalLocation: latlng,
                location: [
                    data[index].geometry.location.lat(),
                    data[index].geometry.location.lng()
                ]
            }
        })
        .then(function(data) {
            var coffee = nearestCoffeeAsync({ 
                location: data.location, 
                radius: 50000
            })
            return Promise.all([ Promise.resolve(data), coffee ])
        })
        .spread(function(place, results) {
            var result = xtend(place, { 
                cafe: results.length === 0 ? null : results[0].name 
            })
            return result
        })
}