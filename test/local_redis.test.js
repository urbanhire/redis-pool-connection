var test = require('tape')
var decache = require('decache') // http://goo.gl/JIjK9Y

var dir = __dirname.split('/')[__dirname.split('/').length - 1]
var file = dir + __filename.replace(__dirname, '') + " -> "

var options = {
      host: '127.0.0.1',
      port: 6379,
      options: {
        db: 4
      }
    }

test(file + " Connect to LOCAL Redis instance as Subscriber", function(t) {
  var redisSub = require('../index.js')(options, 'subscriber')
  t.equal(redisSub.address, '127.0.0.1:6379', "✓ Redis Client connected to: " + redisSub.address)
  redisSub.set('redis', 'SUBSCRIBER', function(err, reply) {
    redisSub.get('redis', function(err, reply) {
      t.equal(reply.toString(), 'SUBSCRIBER', '✓ LOCAL Redis is ' + reply.toString())
      t.end()
    })
  })
})

test(file + " Connect to LOCAL Redis instance and GET/SET", function(t) {
  var redisClient = require('../index.js')(options)
  t.equal(redisClient.address, '127.0.0.1:6379', "✓ Redis Client connected to: " + redisClient.address)

  redisClient.set('redis', 'LOCAL', function(err, reply) {
    redisClient.get('redis', function(err, reply) {
      t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' + reply.toString())
      t.end()
    })
  })
})

test('Require an existing Redis connection', function(t) {
  var r2 = require('../index.js')(options)
  r2.get('redis', function(err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' + reply.toString())
    t.end()
  })
})

test('Require an existing Redis SUBSCRIBER connectiong', function(t) {
  var rs2 = require('../index.js')(options, 'subscriber')
  rs2.get('redis', function(err, reply) {
      t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' + reply.toString())
      t.end()
  })
})

test('Close Conection & Reset for Heroku Compatibility tests', function(t) {
  // redisClient.end()
  // redisSub.end()
  require('../index.js').killall() // close all connections
  decache('../index.js')
  t.equal(redisClient.connected, false, "✓ Connection to LOCAL Closed")
  t.end()
})
