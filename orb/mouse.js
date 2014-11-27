var THREE = require('three')

var mouse = require('touch-position').emitter()
var addEvent = require('add-event-listener')
var offset = require('mouse-event-offset')

mouse.vector = new THREE.Vector3()
mouse.raycaster = new THREE.Raycaster()

var lastVec = new THREE.Vector2()
var tmpVec = new THREE.Vector2()
var maxDist = 0
var time = Date.now()
var CLICK_TIME = 500

mouse.update = function(viewer) {
    var mousePos = mouse.position
    var width = viewer.width, 
        height = viewer.height

    mouse.vector.set(mousePos[0]/width * 2 - 1, -mousePos[1]/height * 2 + 1, 0.5)
    mouse.vector.unproject(viewer.camera)
    mouse.vector.sub(viewer.camera.position).normalize()
    mouse.raycaster.set(viewer.camera.position, mouse.vector)
}

mouse.on('move', function(ev) {
    maxDist = Math.max(maxDist, tmpVec.fromArray(mouse.position).distanceTo(lastVec))
})

addEvent(window, 'mousedown', function(ev) {
    var pos = offset(ev)
    handleDown(pos)
})

addEvent(window, 'mouseup', function(ev) {
    var pos = offset(ev)
    handleUp(pos)
})

addEvent(window, 'touchstart', function(ev) {
    ev.preventDefault()
    var touch = ev.targetTouches[0]
    var pos = offset(ev, touch)
    handleDown(pos)
})

addEvent(window, 'touchend', function(ev) {
    var touch = ev.changedTouches[0]
    var pos = offset(ev, touch)
    handleUp(pos)
})

function handleDown(pos) {
    maxDist = 0
    time = Date.now()
    lastVec.copy(pos)
    mouse.emit('down', pos.x, pos.y)
}

function handleUp(pos) {
    if (maxDist < 10 && (Date.now()-time) < CLICK_TIME)  {
        mouse.emit('click', pos.x, pos.y)
    }
}

module.exports = mouse