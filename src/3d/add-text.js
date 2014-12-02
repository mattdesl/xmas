var THREE = require('three')
var TextElement = require('three-sdf-text')(THREE)
var TweenMax = require('gsap')

var number = require('as-number')
var fontImage = require('../texture-cache')('fonts/IstokBold.png')
var mat4 = {
    identity: require('gl-mat4/identity'),
    translate: require('gl-mat4/translate'),
    scale: require('gl-mat4/scale')
}
var mouse = require('../mouse')

var mobile = require('../is-mobile')

var intro = ['tap the Earth\nto find some hot cocoa', 
    (mobile?'swipe':'drag')+' to rotate']
var textTimeout = 2

module.exports = function(viewer, font) {
    var startDelay = 1.8
    var phraseIndex = 0
    var cancel = false

    var fontTex = THREE.ImageUtils.loadTexture(fontImage)
    fontTex.minFilter = THREE.LinearMipMapLinearFilter
    fontTex.magFilter = THREE.LinearFilter
    fontTex.flipY = false
    fontTex.anistrophy = viewer.renderer.getMaxAnisotropy()

    var tween = null
    var lastTheta = null

    var elements = [ createText(), createText('', 0.6) ]

    viewer.on('text', function(dt) {
        if (lastTheta === null || lastTheta !== viewer.controls.theta)
            thetaChanged()

        elements.forEach(function(e) {
            e.text.draw(viewer.camera, e.object3d)
        })
        viewer.renderer.resetGLState()

        lastTheta = viewer.controls.theta
    })

    var show = function(texts, delay, outTime) {
        killAll()
        setHidden(elements)

        if (typeof texts === 'string')
            texts = [texts]

        elements.forEach((e,i) => {
            e.text.element.text = texts[i] || ''
        })
        layout(elements)

        aniIn(elements, delay, outTime)
        // singleLoop(text, e.text, e.object3d)
    }


    show(intro, startDelay, 3)

    return {
        show: show,
        hide: function() {
            aniOut(elements)
        }
    }

    function setHidden(elements) {
        elements.forEach(function(e) {
            e.text.opacity = 0
            e.object3d.scale.y = 0
        })
    }

    function aniIn(elements, delay, outTime) {
        delay = delay||0
        var texts = elements.map(e => e.text)
        var scales = elements.map(e => e.object3d.scale)

        var stagger = 0.1
        TweenMax.killTweensOf([texts, scales])
        TweenMax.staggerTo(texts, 1.0, {
            opacity: 1,
            delay: delay
        }, stagger)
        TweenMax.staggerTo(scales, 1.0, {
            y: 1,
            delay: delay,
            ease: 'easeOutExpo'
        }, stagger)

        var timeout = typeof outTime === 'number' ? outTime : textTimeout
        aniOut(elements, delay + timeout)
    }

    function aniOut(elements, delay) {
        delay = delay||0
        var stagger = 0.05
        var texts = elements.map(e => e.text)
        var scales = elements.map(e => e.object3d.scale)

        TweenMax.staggerTo(texts, 1.0, {
            opacity: 0,
            delay: delay
        }, stagger)
        TweenMax.staggerTo(scales, 1.0, {
            y: 0,
            ease: 'easeOutExpo',
            delay: delay
        }, stagger)
    }

    function createText(str, size) {
        var text = TextElement(viewer.renderer, {
            font: font,
            text: str,
            padding: -4,
            color: 0xfafafa,
            textures: [ fontTex ]
        })

        var textObj = new THREE.Object3D()
        textObj.position.set(0, 0, 0)

        var parent = new THREE.Object3D()
        parent.position.set(0,-1.8,0)
        parent.add(textObj)
        viewer.scene.add(parent)

        return {
            size: size,
            text: text,
            object3d: textObj,
            parent: parent
        }
    }

    function layout(elements) {
        var y = 0

        elements.forEach(function(e, i) {
            e.text.element.align = 'center'
            e.text.element.layout(600)
            position(e.text, y, e.size)
            y -= e.text.element.getBounds().height + e.text.element.getAscender()/4
        })
    }

    function position(text, y, scale) {
        var s = number(scale, 1)
        
        var SCALE = 0.007
        mat4.identity(text.transform)
        mat4.scale(text.transform, text.transform, [SCALE,SCALE,SCALE])

        var bounds = text.element.getBounds()
        var translation = [-s*bounds.width/2, -s*bounds.height + (y||0), 0]
        mat4.translate(text.transform, text.transform, translation)

        var size = [s,s,s]
        mat4.scale(text.transform, text.transform, size)
    }


    function killAll() {
        if (tween) {
            tween.kill()
            tween = null
        }
        elements.forEach(function(e) {
            TweenMax.killTweensOf([
                e.parent.rotation,
                e.text,
                e.object3d.scale
            ])
        })
    }

    function thetaChanged() {
        elements.forEach(function(e) {
            var target = viewer.controls.theta
            target = target-2*Math.PI*Math.floor(target/(2*Math.PI)+0.5)

            TweenMax.killTweensOf(e.parent.rotation)
            TweenMax.to(e.parent.rotation, 0.5, {
                y: target,
                delay: 0.001,
                ease: 'easeOutQuart'
            })
        })
    }
}