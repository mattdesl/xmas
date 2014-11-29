var coffee = require('./get-coffee')
var format = require('format-text')
var places = require('./places')
var throttle = require('lodash.throttle')

function strip(str) {
    return String(str).replace(/\s+/g, ' ').trim()
}

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
        'no hot cocoa here\n{0}',
        'not much around here\n{0}',
        'nothing found near\n{0}',
    ]
    var hotPlaces = [
        'seems a bit hot there already\n{0}',
        "it's kind of warm there already...\n{0}"
    ]
    return throttle(function(latlng) {
        return coffee(latlng).then(function(data) {
            var str
            if (data.cafe) {
                str = strip(data.cafe)+'\n'+strip(data.name)
            } else {
                var country = strip(data.country) //hmm use country or place?
                var randList = nothingFound.slice()
                if (places.hot(country)) {
                    randList = randList.concat(hotPlaces)
                }
                var loc = strip(data.name)
                var randFound = randList[~~(Math.random()*randList.length)]
                str = format(randFound, loc)
            }
            var texts = str.split('\n')
            text.show(texts)
        }).catch(function(err) {
            text.show(errorPhrases[~~(Math.random()*errorPhrases.length)])
        })
    }, 3500)
}