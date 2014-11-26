var TweenMax = require('gsap')
var config = require('../config')
var mobile = require('../is-mobile')
var addEvent = require('add-event-listener')

module.exports = function() {
    var about = document.querySelector('.about')
    var spinner = document.querySelector('#spinner')
    var openAbout = document.querySelector('.about-button')
    var closeAbout = document.querySelector('.close-button')

    TweenMax.to(spinner, 1, {
        autoAlpha: 0,
        ease: 'easeOutExpo',
        delay: 0.35
    })

    TweenMax.set(openAbout, { 
        display: 'block', margin: mobile?20:40, y: -100 
    })
    TweenMax.to(openAbout, 1.0, {
        delay: config.startDelay+0.1,
        y: 0,
        ease: 'easeOutExpo'
    })

    var open = false

    addEvent(openAbout, 'click', function(ev) {
        open = !open
        about.style.display = open ? 'block' : 'none'
    })

    addEvent(closeAbout, 'click', function(ev) {
        open = false
        about.style.display = 'none'
    })

}