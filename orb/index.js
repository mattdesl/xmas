var THREE = require('three')
var create = require('./three-mesh-viewer')(THREE)
var fs = require('fs')

// var box = new THREE.BoxGeometry(1, 1, 1)
// var mat = new THREE.MeshBasicMaterial({ 
//     color: 0xffeeee
// })
// var mesh = new THREE.Mesh(box, mat)

require('./create-mesh')(function(err, mesh) {
    var viewer = create(mesh)

    viewer.scene.fog = new THREE.FogExp2(0xeeeeee, 0.2)
    require('./add-lights')(viewer.scene)
    var syncFloor = require('./add-floor')(viewer.scene)

    var t = 0
    viewer.on('tick', function() {
        t += 1/60

        mesh.position.x = Math.sin(Math.cos(t))
        mesh.position.y = Math.sin(t)*1.5
        mesh.position.z = Math.sin(t)*0.5
        syncFloor(mesh)
    })
})