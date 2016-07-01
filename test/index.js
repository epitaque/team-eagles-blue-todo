var should = require('should');
var request = require('supertest');
var assert = require('assert');
var mongoose = require('mongoose');
var config = require('../lib/config');

describe('routing', () => {
  var server;

  // Within before() you can run all the operations
  // that are needed to setup the tests.

  /*
  before(done => {
    server = require('../lib/server');

    // Create a connection to the database
    // mongoose.connect(config.db.mongodb);
    done();
  });
  */


  beforeEach(() => server = require('../lib/server'));
  afterEach(() => server.close());

  describe('GET /users', () => {
    it('should respond with json', (done) => {
      request(server)
        .get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  


});
