var THREE = require('three')
var array = require('array-range')

var Floor = require('./create-floor')
var syncFloor = require('./sync-floor')
var lerp = require('lerp')


module.exports = function(viewer, mesh) {
    var floor = Floor()
    var t

    viewer.scene.add(floor)

    mesh.position.y = 4


    var sphere = new THREE.SphereGeometry(1.15, 50, 50)
    var mat = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('img/earth1-medium.jpg'),
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

        earth.position.copy(mesh.position)
        syncFloor(floor, mesh)
    }
}