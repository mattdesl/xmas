var THREE = require('three')
var array = require('array-range')

var Floor = require('./create-floor')
var syncFloor = require('./sync-floor')
var lerp = require('lerp')

module.exports = function(viewer, mesh) {
    var floor = Floor()
    var t = 0
    var START = 4

    viewer.scene.add(floor)

    mesh.position.y = START


    var sphere = new THREE.SphereGeometry(1.15, 50, 50)
    var tex = THREE.ImageUtils.loadTexture('img/earth1-small.jpg')

    var mat = new THREE.MeshBasicMaterial({
        map: tex,
        fog: false
    })
    var earth = new THREE.Mesh(sphere, mat)
    viewer.scene.add(earth)
    viewer.scene.add(mesh)


    viewer.on('tick', function() {
        update(1/60)
    })

    update(0.0)

    function update(dt) {
        t += dt

        var spd = 0.04
        earth.rotation.y += dt * spd
        mesh.position.y = Math.sin(t*0.5) * 0.1 + START
        earth.position.copy(mesh.position)
        syncFloor(floor, mesh)
    }
}