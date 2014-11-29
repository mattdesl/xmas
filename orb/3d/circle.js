var number = require('as-number')
var THREE = require('three')
var arc = require('arc-to')
var Line = require('three-line-2d')(THREE)
var BasicShader = require('three-line-2d/shaders/basic')(THREE)
var DashShader = require('../shaders/line')

module.exports = function() {
    var path = arc(0, 0, 0.5, 0, Math.PI*2, false, 64)
    path.pop()

    //create our geometry
    var curveGeometry = Line(path, { closed: true, distances: true })

    //create a material using a basic shader
    var mat = new THREE.ShaderMaterial(DashShader({
        side: THREE.FrontSide,
        diffuse: 0xffffff,
        transparent: true,
        thickness: 0.2,
        opacity: 0.8,
        
        depthTest: false,
        depthWrite: false,
        fog: false,
        // lights: false
    }))

    return new THREE.Mesh(curveGeometry, mat)
}