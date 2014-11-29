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
    var lastTween = null

    addEvent(openAbout, 'click', function(ev) {
        open = !open
        if (open) aniIn()
        else aniOut()

        // about.style.display = open ? 'block' : 'none'
    })

    addEvent(closeAbout, 'click', function(ev) {
        open = false
        aniOut()
    })

    function aniIn() {
        if (lastTween) 
            lastTween.kill()    
        TweenMax.set(about, {
            display: 'block',
            rotationX: '90deg',
            z: '-400px',
            transformOrigin: 'center'
        })
        lastTween = TweenMax.to(about, 1.0, {
            ease: 'easeOutExpo',
            y: '0px',
            rotationX: '0deg',
            z: '0px'
        })

        TweenMax.set(about.children, { opacity: 0 })
        var stagger = 0.03, delay = 0.2
        TweenMax.staggerTo(about.children, 1, {
            delay: delay,
            opacity: 1,
            // ease: 'easeOutQuad'
        }, stagger)
    }

    function aniOut() {
        if (lastTween) 
            lastTween.kill()    
        lastTween = TweenMax.to(about, 0.5, {
            ease: 'easeOutExpo',
            z: '-400px',
            rotationX: '90deg',
            onComplete: function() {
                about.style.display = 'none'
            }
        })

    }
}