var THREE = require('three')
var create = require('./three-mesh-viewer')(THREE)
var fs = require('fs')

// var box = new THREE.BoxGeometry(1, 1, 1)
// var mat = new THREE.MeshBasicMaterial({ 
//     color: 0xffeeee
// })
// var mesh = new THREE.Mesh(box, mat)

require('./create-mesh')(function(err, mesh) {
    var viewer = create()
    var tmp = new THREE.Vector3()
    var UNIT_X = new THREE.Vector3(0, 0, 1)
    
    viewer.controls.target.set(0, 4, 0)
    viewer.camera.position.set(5, 8, 5)
    
    // viewer.scene.fog = new THREE.FogExp2(0xeeeeee, 0.2)
    require('./add-lights')(viewer.scene)
    require('./scene')(viewer, mesh)
})