var THREE = require('three')
var TweenMax = require('gsap')
var Circle = require('./circle')
var lerp = require('lerp')

module.exports = function(viewer) {
    var circle = Circle()
    var CIRCLE_SCALE = 0.1
    circle.visible = false
    circle.scale.multiplyScalar(CIRCLE_SCALE)

    viewer.scene.add(circle)

    viewer.on('tick', function() {
        // circle.lookAt(viewer.camera.position)
    })  

    var lastTween = null
    var tween = {
        value: 0
    }

    function aniInCircle() {
        if (lastTween)
            lastTween.kill()

        var s = 0.0001
        circle.visible = true
        circle.scale.set(s,s,s)
        tween.value = 0

        TweenMax.to(circle.scale, 1, {
            x: CIRCLE_SCALE, y: CIRCLE_SCALE, z: CIRCLE_SCALE, 
            ease: 'easeOutExpo'
        })
        TweenMax.to(tween, 1, {
            onUpdate: updateMaterials,
            value: 1.0, 
            delay: 0.0,
            ease: 'easeOutQuart'
        })

        lastTween = TweenMax.to(circle.scale, 0.5, {
            ease: 'easeOutExpo',
            x: s, y: s, z: s,
            delay: 2.0
        })

        updateMaterials()
    }

    function updateMaterials() {
        circle.material.uniforms.dashDistance.value = lerp(0, 0.3, tween.value)
        circle.material.uniforms.dashSteps.value = lerp(5, 10, tween.value)
    }



    return {
        mesh: circle,
        show: aniInCircle
    }
}