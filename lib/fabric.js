'use strict';

var util = require('util');

var Peer = require('./peer');
var Vector = require('./vector');
var _ = require('./functions');

/**
 * Fabric Core Library
 * @constructor
 * @param {object} config - configuration object
 */
function Fabric (vector) {
  this['@data'] = vector || {};

  this.clock = 0;
  this.stack = [];
  this.known = {};

  this.identity = {};
  this.peers = {};

  this.init();
}

util.inherits(Fabric, Vector);

Fabric.add = function combineVectors (a, b) {
  return a + b;
};

/**
 * Consume an application definition (configure resources + services)
 * @param {object} vector - Object representation of the application definition.
 * @param {function} notify - Callback function (err, result)
 */
Fabric.prototype.bootstrap = function configureSandbox (vector, notify) {
  if (!vector) vector = null;
  if (!notify) notify = new Function();

  this.emit('vector', {
    vector: vector
  });

  return notify('Not yet implemented');
};

// for all known peers locally, ask for data
// aka: promiscuous mode
Fabric.prototype.explore = function crawl () {
  var fabric = this;
  var list = Object.keys(fabric['@data'].peers).forEach(function(x) {

    peer.on('identity', function sandbox (identity) {
      console.log('sandbox inner:', identity);
    });
    
    // neat!
    peer.compute();
  });
};

Fabric.prototype.connect = async function dock (id) {
  var self = this;
  var peer = new Peer(id);

  await peer._connect();
  
  // TODO: webrtc here
  self.peers[id] = peer;
  
  return peer;
};

Fabric.prototype.identify = function generateKeys (vector, notify) {
  if (!vector) vector = {};
  if (!notify) notify = new Function();

  var self = this;
  var identity = {
    key: {
      public: 'foo'
    }
  }
  
  self.identity = identity;
  self.use('NOOP', function () {
    return this;
  })
  
  // a "vector" is a known truth, something that we've generated ourselves
  // or otherwise derived truth from an origin (a genesis vector
  // TODO: remove lodash
  self['@data'] = _.merge(self['@data'], vector, identity); // should be equivalent to `f(x + y)`

  this.emit('auth', identity);

  return notify();
};

Fabric.prototype.broadcast = function announcer (msg, data) {
  var self = this;

  self.emit(msg, data);

  Object.keys(self.peers).forEach(function tell (id) {
    var peer = self.peers[id];
    peer.send(msg);
  });
  
  return true;
};

Fabric.prototype.start = function init (done) {
  var self = this;
  self.identify();
  // self.compute();
  // return done();
};

/**
 * Consume a known state and
 * @constructor
 * @param {object} config - configuration object
 */
Fabric.prototype.render = function consume () {
  return JSON.stringify(this['@data']);
};

module.exports = Fabric;
