var createGL = require('gl-context')
var createCamera = require('canvas-orbit-camera')
var Geom   = require('gl-geometry')
var clear  = require('gl-clear')({ color: [1,1,1,1] })
var mat4   = require('gl-mat4')
var Shader = require('gl-basic-shader')

module.exports = function(complex) {
  var canvas = document.body.appendChild(document.createElement('canvas'))
  var gl = createGL(canvas, render)
  var camera = createCamera(canvas)

  var mesh = Geom(gl)
    .attr('position', complex.positions)
    .faces(complex.cells)

  window.addEventListener('resize'
    , require('canvas-fit')(canvas)
    , false
  )

  var proj  = mat4.create()
  var view  = mat4.create()
  var model = mat4.create()
  var shader = Shader(gl)

  mat4.scale(model, model, [1,-1,1])

  function render() {
    var width  = canvas.width
    var height = canvas.height

    gl.viewport(0, 0, width, height)
    clear(gl)

    camera.view(view)
    camera.tick()
    mat4.perspective(proj
      , Math.PI / 4
      , width / height
      , 1000
      , 0.01
    )

    shader.bind()
    mesh.bind(shader)
    shader.uniforms.tint = [1,0,0,1]
    shader.uniforms.projection  = proj
    shader.uniforms.view  = view
    shader.uniforms.model = model
    mesh.draw(gl.LINES)
    mesh.unbind()
  }
}