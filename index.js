const redis = require('redis')
require('redis-delete-wildcard')(redis)
const result = require('lodash.result')
const CON = {} // store redis connections as Object

function newConnection (conf) {
  var redisConnection = redis.createClient(conf)
  if (result(conf, 'options.db')) {
    redisConnection.select(conf.options.db)
  }

  redisConnection.on('error', function (err) {
    console.error('Error ' + err)
  })

  return redisConnection
}

function redisPoolConnection (options, type) {
  type = type || 'DEFAULT' // allow infinite types of connections

  if (!CON[type] || !CON[type].connected) {
    CON[type] = newConnection(options)
  }
  return CON[type]
}

module.exports = redisPoolConnection

module.exports.kill = function (type) {
  type = type || 'DEFAULT' // kill specific connection or default one
  CON[type].end()
  delete CON[type]
}

module.exports.killall = function () {
  var keys = Object.keys(CON)
  keys.forEach(function (k) {
    CON[k].end()
    delete CON[k]
  })
}
