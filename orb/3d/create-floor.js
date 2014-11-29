var smoothstep = require('smoothstep')
var lerp = require('lerp')
var THREE = require('three')
var clamp = require('clamp')
var range = require('unlerp')

module.exports = function() {
    var DEPTH = 0.0
    var plane = new THREE.PlaneBufferGeometry(1, 1, 1)

    var tex = THREE.ImageUtils.loadTexture('img/blob.png')

    var mat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        ambient: 0x000000,
        blending: THREE.NormalBlending,
        transparent: true,
        lights: false,
        fog: false,
        opacity: 0.25,
        map: tex
    })
    var floor = new THREE.Mesh(plane, mat)
    floor.scale.multiplyScalar(3)
    floor.position.y = -DEPTH
    floor.rotation.x = -Math.PI/2

    return floor
}