var smoothstep = require('smoothstep')
var lerp = require('lerp')
var THREE = require('three')
var clamp = require('clamp')
var range = require('unlerp')

module.exports = function update(floor, target) {
    floor.position.x = target.position.x
    floor.position.z = target.position.z

    var d = target.position.distanceTo(floor.position)
    d = 1.0 - clamp(range(1, 6, d), 0, 1)
    floor.material.opacity = lerp(0.0, 0.6, d)

    var s = lerp(2, 5, d)
    floor.scale.set(s, s, s)
}