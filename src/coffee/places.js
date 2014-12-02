var places = {
    hot: ['brazil', 'columbia', 'peru', 'bolivia', 'argentina', 'suriname',
    'angola','zimbabwe','democratic republic of the congo', 'gabon', 'nigeria',
    'mali','cameroon']
}

module.exports.hot = function(name) {
    return places.hot.indexOf(name.toLowerCase()) !== -1
}