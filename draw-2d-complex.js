//draws a 2d simplicial complex (e.g. list of indexed triangles)

module.exports = function drawTriangles(ctx, complex) {
    var v = complex.positions

    complex.cells.forEach(function(f) {
        var v0 = v[f[0]],
            v1 = v[f[1]],
            v2 = v[f[2]]
        ctx.moveTo(v0[0], v0[1])
        ctx.lineTo(v1[0], v1[1])
        ctx.lineTo(v2[0], v2[1])
        ctx.lineTo(v0[0], v0[1])
    })
}