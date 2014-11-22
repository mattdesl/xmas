var random = require('gl-vec3/random')
var array = require('array-range')
var THREE = require('three')
var randf = require('randf')

module.exports = function(viewer) {
    var box = new THREE.BoxGeometry(1, 1, 1)
    var mat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    })

    var stars = array(500).map(function() {
        var scale = 100
        var pos = random([0, 0, 0], scale)

        var mesh = new THREE.Mesh(box, mat.clone())
        mesh.material.opacity = randf(0.05, 0.5)
        mesh.position.fromArray(pos)
        mesh.scale.multiplyScalar(randf(0.1, 0.5))
        return mesh
    })

    stars.forEach(function(s) {
        viewer.scene.add(s)
    })
}