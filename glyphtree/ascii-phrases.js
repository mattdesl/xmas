// var ascii = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890\"!`?'.,;:()[]{}<>|/@^$-%+=#_&~*¡¢£¤¥¦§¨©ª«®¯°±²³´µ¶·¸¹º»¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
var phrases = require('./phrases.json')

function characters(str) {
    var chrs = []
    for (var i=0; i<str.length; i++)
        chrs.push(str.charAt(i))
    return chrs
}

function unsupported(c) {
    var code = c.charCodeAt(0)
    return code > 256
}

module.exports = phrases.filter(function(p) {
    return !characters(p).some(unsupported)
})