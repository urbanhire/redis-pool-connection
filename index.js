var redis = require('redis')
var result = require('lodash.result')
var CON = {} // store redis connections as Object

function new_connection (conf) {
  var redis_con = redis.createClient(conf)
  if (result(conf, 'options.db')) {
    redis_con.select(conf.options.db)
  }

  redis_con.on('error', function (err) {
    console.error('Error ' + err)
  })

  return redis_con
}

function redis_connection (options, type) {
  type = type || 'DEFAULT' // allow infinite types of connections

  if (!CON[type] || !CON[type].connected) {
    CON[type] = new_connection(options)
  }
  return CON[type]
}

module.exports = redis_connection

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
