var THREE = require('three')
var TweenMax = require('gsap')
var Circle = require('./circle')
var lerp = require('lerp')

module.exports = function(viewer, earth) {
    var tmpPos = new THREE.Vector3()
    var circle = Circle()
    // var innerCircle = circle.clone()

    var mesh = new THREE.Object3D()
    mesh.add(circle)
    // mesh.add(innerCircle)

    var CIRCLE_SCALE = 0.1
    mesh.visible = false
    mesh.scale.multiplyScalar(CIRCLE_SCALE)

    // innerCircle.material = innerCircle.material.clone()
    // innerCircle.material.uniforms.thickness /= 2
    // innerCircle.scale.multiplyScalar(0.5)

    // viewer.scene.add(mesh)

    viewer.on('tick', function() {
        // if (earth)
            // mesh.rotation.y = earth.rotation.y
        // circle.lookAt(viewer.camera.position)
    })  

    var tweens = []
    var tween = {
        value: 0
    }

    function aniInCircle() {
        tweens.forEach(t => t.kill())
        tweens.length = 0

        mesh.visible = true
        tween.value = 1

        circle.material.uniforms.dashed.value = 1

        tweens.push(TweenMax.to(tween, 1, {
            onUpdate: updateMaterials,
            onComplete: setDash(false),
            value: 0.0, 
            delay: 0.0,
            ease: 'easeOutQuart'
        }))

        tweens.push(TweenMax.to(tween, 1, {
            ease: 'easeOutExpo',
            value: 1,
            onStart: setDash(true),
            onUpdate: updateMaterials,
            onComplete: setVisible(false),
            delay: 2.5
        }))

        updateMaterials()
    }

    function setVisible(visible) {
        return function() {
            mesh.visible = visible
        }
    }

    function setDash(enabled) {
        return function() {
            circle.material.uniforms.dashed.value = enabled ? 1 : 0
        }
    }

    function updateMaterials() {
        circle.material.uniforms.dashDistance.value = lerp(0, 0.6, tween.value)
        circle.material.uniforms.dashSteps.value = lerp(8, 0, tween.value)
    }



    return {
        place: function(position, target, radius) {
            tmpPos.copy(position).sub(target).normalize()
            tmpPos.multiplyScalar(radius * 1.1 * (1/CIRCLE_SCALE)).add(target)

            circle.position.copy(tmpPos)
            circle.lookAt(target)
        },

        mesh: mesh,

        show: aniInCircle
    }
}