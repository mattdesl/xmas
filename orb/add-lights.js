var THREE = require('three')
module.exports = function(scene) {
    scene.add(new THREE.AmbientLight(0x404040))
    scene.add(new THREE.HemisphereLight(0xd6edf7, 0x696969, 1.0))

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.15)
    directionalLight.position.set(5, 5, -2)
    scene.add(directionalLight)
}