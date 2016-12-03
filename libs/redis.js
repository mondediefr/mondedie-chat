"use strict";
var Promise = require('bluebird');
var redis   = require('redis');

Promise.promisifyAll(redis.RedisClient.prototype);

module.exports = function() {
  return {
    client:redis.createClient(process.env.REDIS_URL),
    init:function(client) {
      client.del('users:connected');
    }
  }
}
