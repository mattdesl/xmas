var random = require('gl-vec3/random')
var array = require('array-range')
var THREE = require('three')
var randf = require('randf')
var TweenMax = require('gsap')
var config = require('./config')

module.exports = function(viewer) {
    var box = new THREE.BoxGeometry(1, 1, 1)
    var mat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true
    })

    var delay = config.startDelay + 0.25
    var stars = array(500).map(function(i) {
        var scale = 100
        var pos = random([0, 0, 0], scale)

        var mesh = new THREE.Mesh(box, mat.clone())
        mesh.material.opacity = randf(0.05, 0.5)
        mesh.position.fromArray(pos)
            
        var s = randf(0.1, 0.5)
        var start = 0.0001
        mesh.scale.set(start,start,start)
        TweenMax.to(mesh.scale, 1.0, {
            ease: 'easeOutExpo',
            x: s, y: s, z: s,
            delay: delay += 0.005
        })
        return mesh
    })

    stars.forEach(function(s) {
        viewer.scene.add(s)
    })
}