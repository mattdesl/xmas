var TweenMax = require('gsap')
var config = require('../config')
var mobile = require('../is-mobile')
var addEvent = require('add-event-listener')
var Emitter = require('events/')
var isSafari = require('../is-old-safari')

module.exports = function() {
    // require('fastclick')(document.body)

    //safari can't seem to handle CSS 3D animations
    //on top of the webgl content?!?!
    var animations = !mobile && !isSafari

    var about = document.querySelector('.about')
    var spinner = document.querySelector('#spinner')
    var openAbout = document.querySelector('.about-button')
    var closeAbout = document.querySelector('.close-button')

    var emitter = new Emitter()
    emitter.open = false

    TweenMax.to(spinner, 1, {
        autoAlpha: 0,
        ease: 'easeOutExpo',
        delay: 0.35
    })

    TweenMax.set(openAbout, { 
        display: 'block', margin: mobile?0:20, y: -100 
    })
    if (mobile) //kinda ugly
        document.querySelector('.google').style.right = '10px'

    TweenMax.to(openAbout, 1.0, {
        delay: config.startDelay+0.1,
        y: 0,
        ease: 'easeOutExpo'
    })

    var lastTween = null

    function tap(ev) {
        ev.preventDefault()
        emitter.open = !emitter.open
        if (emitter.open) {
            if (animations) aniIn()
            emitter.emit('open')
        }
        else {
            if (animations) aniOut()
            emitter.emit('closed')
        }
        if (!animations)
            about.style.display = emitter.open ? 'block' : 'none'
    }

    addEvent(openAbout, 'click', tap)
    addEvent(openAbout, 'touchstart', tap)

    function tapClose(ev) {
        ev.preventDefault()
        emitter.open = false
        if (animations) 
            aniOut()
        else 
            about.style.display = 'none'
    }
    addEvent(closeAbout, 'click', tapClose)
    addEvent(closeAbout, 'touchstart', tapClose)

    return emitter
        

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