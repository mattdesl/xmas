var THREE = require('three')
var array = require('array-range')

var World = require('verlet-system/3d')
var Point = require('verlet-point/3d')
var Constraint = require('verlet-constraint/3d')
var Floor = require('./create-floor')
var syncFloor = require('./sync-floor')
var lerp = require('lerp')

module.exports = function(viewer, mesh) {
    var tmp = new THREE.Vector3()
    var floor = Floor()

    var RADIUS = 1.3
    var YSTART = 4
    var t = 0

    var world = World({ 
        gravity: [0, -25, 0],
        min: [null, 0, null],
        bounce: 0.6
    })  

    var ball = createBallBody(mesh, floor, {
        position: [0.0, YSTART, 0.0],
        radius: RADIUS
    })

    var ANCHOR_POS = [0, 15, 0]
    var anchor = Point({
        position: ANCHOR_POS.slice()
    })

    setTimeout(function() {
        ball.addForce([0.1, 0, -0.0])
    }, 25)

    var bodies = [ ball ]

    //add all line points
    var linePoints = array(2).map(function(e, i, self) {
        var a = i/(self.length-1)
        return Point({
            mass: 10000000,
            position: [0, lerp(YSTART, ANCHOR_POS[1], a), 0 ]
        })
    })

    var points = [ [ball, linePoints[0]] ]
    for (var i=0; i<linePoints; i+=2) {
        if (!linePoints[i+1]) 
            break
        points.push([ linePoints[i], linePoints[i+1] ])
    }
    points.push([ linePoints[linePoints.length-1], anchor ])

    var constraints = points.map(function(p) {
        return Constraint(p, { restingDistance: 3, stiffness: 0.008 })
    })

    //finally add the anchor
    bodies.push(anchor)

    bodies.forEach(addBody)

    viewer.on('tick', function() {
        update(1/60)
    })

    update(0.0)

    function createLine() {

    }

    function createBallBody(mesh, floor, opt) {
        var p = Point(opt)
        p.floor = floor
        p.ball = mesh
        return p
    }

    function addBody(b) {
        if (!b.ball)
            return

        viewer.scene.add(b.floor)
        viewer.scene.add(b.ball)
    }

    function update(dt) {
        t += dt


        // constraints.forEach(function(c) {
        //     c.solve()
        // })
        // anchor.place(ANCHOR_POS)
        // world.integrate(bodies, dt)




        bodies.forEach(function(b) {
            if (!b.ball)
                return

            // tmp.set(anchor.position[0], anchor.position[1], anchor.position[2])
            //fix glitch with lookAt
            // b.ball.lookAt(tmp)

            b.ball.position.x = b.position[0] 
            b.ball.position.y = b.position[1] 
            b.ball.position.z = b.position[2] 
            syncFloor(b.floor, b.ball)
        })
    }
}