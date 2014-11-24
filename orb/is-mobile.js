var deviceType = require('ua-device-type')
module.exports = /(phone)|(tablet)/i.test(deviceType(navigator.userAgent))