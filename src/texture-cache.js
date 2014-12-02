module.exports = function(path) {
    if (path)
        module.exports.paths.push(path)
    return path
}

module.exports.paths = []