
// var mesh = require('bunny')
var icosphere = require('icosphere')
var mesh = icosphere(4)

var glslify = require('glslify')
var createShader = glslify({
    vertex: __dirname+'/shaders/sphere.vert',
    fragment: __dirname+'/shaders/sphere.frag'
})

var opt = {
    // lines: true,
    shader: createShader
}

require('frontend-npm-goodies/webgl/orbit-viewer')(mesh, opt)