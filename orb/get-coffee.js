/*globals google*/

var Promise = require('bluebird')
var nearestCoffee = Promise.promisify(require('nearest-coffee'))
var geocode = require('./geocode')
var xtend = require('xtend')

module.exports = function(latlng) {
    return geocode(latlng)
        .then(function(data) {
            if (data.length===0)
                return Promise.reject('could not get geocode info')

            var index = Math.max(0, data.length-3)
            return { 
                name: data[index].formatted_address,
                originalLocation: latlng,
                location: [
                    data[index].geometry.location.lat(),
                    data[index].geometry.location.lng()
                ]
            }
        })
        .then(function(data) {
            var coffee = nearestCoffee({ 
                location: data.location, 
                radius: 50000
            })
            return Promise.all([ Promise.resolve(data), coffee ])
        })
        .spread(function(place, results) {
            if (results.length === 0)
                return Promise.reject("no coffee found")

            console.log(results[0].name,'in',place.name)
            return xtend(place, { cafe: results[0].name })
        })
            
            // return nearestCoffee({
            //     location: data.location,
            //     radius: 50000
            // }, function(err, coffee) {
            //     if (err) throw err
            //     console.log(coffee)
            // })
        // })

    // pos = [44.2382181,-100.1236762]
    //[40.758895,-73.985131]
    // coffee({ location: pos, radius: 50000 }), function(err, data) {
    //     if (err)throw err
    //     console.log(data.map(function(d) {
    //         return d.vicinity
    //     }))
    // })
}