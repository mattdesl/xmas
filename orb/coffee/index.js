var coffee = require('./get-coffee')
var format = require('format-text')
var places = require('./places')
var throttle = require('lodash.throttle')

module.exports = function(text) {
    var errorPhrases = [
        'nope... try again!',
        'no hot cocoa here...',
        'nothing found',
        'not much of anything out here',
        "it's a bit barren here...",
        'lots of fish, not so much hot cocoa'
    ]
    var nothingFound = [
        'not much in {0}',
        'not much around {0}',
        'nothing found near {0}',
        'hot cocoa must not be so popular in {0}',
    ]
    var hotPlaces = [
        'seems a bit hot there already',
        "it's kind of warm there already.."
    ]
    return throttle(function(latlng) {
        return coffee(latlng).then(function(data) {
            var str
            if (data.cafe) {
                str = String(data.cafe).trim()+'\n'+String(data.name).trim()
            } else {
                var country = String(data.country).trim()
                var randList = nothingFound.slice()
                if (places.hot(country))
                    randList = randList.concat(hotPlaces)
                var randFound = randList[~~(Math.random()*randList.length)]
                str = format(randFound, country)
            }
            text.show(str.trim())
        }).catch(function(err) {
            // console.log(err)
            text.show(errorPhrases[~~(Math.random()*errorPhrases.length)])
        })
    }, 3500)
}