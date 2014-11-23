var THREE = require('three')

module.exports = function(cb) {
    cb = cb || ()=>{}

    var loader = new THREE.JSONLoader(false)
    loader.load("models/gift1.js", function(geometry, materials) {
        // geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2))
        geometry.computeVertexNormals()

        materials.forEach(function(m) {
            m.shading = THREE.FlatShading
        })

        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials))
        cb(null, mesh)
    })
}