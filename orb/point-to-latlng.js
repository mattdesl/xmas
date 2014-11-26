module.exports = function(vec, radius, rotation) {
    rotation = rotation||0
    rotation *= 180/Math.PI
    rotation += 90

    radius = radius||1
    var x = vec.x, y = vec.y, z = vec.z
    var lat = 90 - (Math.acos(y / radius)) * 180 / Math.PI
    var lon = ((rotation + (Math.atan2(x, z)) * 180 / Math.PI) % 360) - 180
    lat = Math.round(lat * 100000) / 100000
    lon = Math.round(lon * 100000) / 100000
    return [lat, lon]
}