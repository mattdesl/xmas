var THREE = require('three')
var Promise = require('bluebird')
var img = Promise.promisify(require('img'))

//quick preloader which ensures everything is at least in cache
//should reduce "popping"
module.exports = function(paths) {
    paths = paths||[]
    return Promise.all(paths.map(function(p) {
        return img(p).then(function(i) {
            return i
        })
    }))
}