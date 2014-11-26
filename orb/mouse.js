var THREE = require('three')

var mouse = require('touch-position').emitter()
var addEvent = require('add-event-listener')
var offset = require('mouse-event-offset')

mouse.vector = new THREE.Vector3()
mouse.raycaster = new THREE.Raycaster()

mouse.update = function(viewer) {
    var mousePos = mouse.position
    var width = viewer.width, 
        height = viewer.height

    mouse.vector.set(mousePos[0]/width * 2 - 1, -mousePos[1]/height * 2 + 1, 0.5)
    mouse.vector.unproject(viewer.camera)
    mouse.vector.sub(viewer.camera.position).normalize()
    mouse.raycaster.set(viewer.camera.position, mouse.vector)
}

addEvent(window, 'click', function(ev) {
    var pos = offset(ev)
    mouse.emit('click', pos.x, pos.y)
})

module.exports = mouse