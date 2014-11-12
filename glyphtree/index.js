var getBounds = require('getboundingbox')
var normalizePath = require('normalize-path-scale')


var phrases = require('./ascii-phrases')

// var clear = require('gl-clear')({ color: [1,1,1,1] })
// var Text = require('gl-sprite-text')
// var Lato = require('bmfont-lato/64')
// var Shader = require('gl-basic-shader')
// var mat4 = require('gl-mat4')

var wireframe = require('gl-wireframe')
var tree = require('./tree.json')
var contours = require('svg-path-contours')
var parse = require('parse-svg-path')
var triangulate = require('triangulate-contours')
var delaunay = require('delaunay-triangulate')
var drawTriangles = require('./draw-2d-complex')
var simplify = require('simplify-path')

var mat4 = require('gl-mat4')
var vec3 = require('gl-matrix').vec3

var treeMesh = contours(parse(tree))

//simplify path
treeMesh = treeMesh.map(function(p) {
    return simplify(p, 1)
})
// .filter(function(p) {
//     return p.length>2
// })
//normalize path
treeMesh = normalize(treeMesh)



//triangulate path
treeMesh = asWireframe(triangulate3d(treeMesh))

require('./mesh-viewer')(treeMesh)

function normalize(mesh) {
    var box = getBounds(flatten(mesh))
    return mesh.map(function(p) {
        return normalizePath(p, box)
    })
}

// function copyRotate(mesh) {
//     mesh.positions
// }

function triangulate3d(mesh) {
    var positions = flatten(mesh)
    var out = {
        cells: delaunay(positions),
        positions: positions 
    }
    out.positions = out.positions.map(function(p) {
        return [p[0], p[1], p[2]||0]
    })
    return out
}

function tess3d(mesh) {
    var complex = triangulate(mesh)
    complex.positions = complex.positions.map(function(p) {
        return [p[0], p[1], p[2]||0]
    })
    return complex
}

function asWireframe(mesh) {
    mesh.cells = wireframe(mesh.cells)
    return mesh
}

function flatten(array) {
    return array.reduce(function(a, b) {
        return a.concat(b)
    })
}