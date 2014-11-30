var domready = require('domready')
var create = require('./orb')
var img = require('img')

domready(function() {
    var webgl = require('webgl-context')()

    if (!webgl) {
        var spin = document.getElementById('spinner')
        spin.style.display = 'none'

        var el = document.getElementById('nowebgl')
        el.style.display = 'block'

        var bg = document.getElementById('nowebgl-background')
        bg.style['background-image'] = 'url(../img/nowebgl.jpg)'
    } else {
        create()
            .catch(function(err) {
                console.error("ERROR\n", err)
            })
    }    
})

