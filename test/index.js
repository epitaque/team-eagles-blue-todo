var should = require('should');
var assert = require('assert');
var mongoose = require('mongoose');
var config = require('../lib/config');

describe('routing', () => {

  // Within before() you can run all the operations
  // that are needed to setup the tests.
  before(done => {
    // Create a connection to the database
    mongoose.connect(config.db.mongodb);
    done();
  });

  /*
  describe('Account', () => {
    it('should return error if user')
  });
  */



});
