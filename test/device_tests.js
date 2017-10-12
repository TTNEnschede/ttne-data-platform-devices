'use strict'

const config    = require('./../config');
const mongoose  = require('mongoose');
const supertest = require('supertest');
const should    = require('should');
const server    = supertest.agent(config.base_url);

const testdata  = require('./test_data.js');

describe("* Device test",function () {

    // Setup test environment.
    // Maybe populate database?
    before(function (done) {
        // Before test execution
        console.log('Set up test environment.');

        // Connect to the database
        mongoose.Promise = require('bluebird');
        mongoose.connect(config.db.uri, { useMongoClient: true });
        var db = mongoose.connection;
        db.once('open', function () {
            console.log('* Connected to test database.');

            // Add test data.
            testdata.importData(function (err) {
                // Close connection.
                mongoose.connection.close();
                return done();
            });
        });
    });

    // Teardown test environment.
    // Maybe drop database?
    after(function (done) {
        // After test execution
        console.log('Tear down test environment.');
        
        // Connect to the database
        mongoose.Promise = require('bluebird');
        mongoose.connect(config.db.uri, { useMongoClient: true });
        var db = mongoose.connection;
        db.once('open', function () {
            db.db.dropDatabase();
            console.log('* Dropped test database.');

            // Close connection.
            mongoose.connection.close();
            return done();
        });
    });

    // Actual tests
    it('should produce an error (400) for request with only latitude parameter', function (done) {
        server.get('/api/devices?latitude=52.2207814')
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(400)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it('should produce an error (400) for request with only longitude parameter', function (done) {
        server.get('/api/devices?longitude=6.8888004')
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(400)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it('should return a list of 3 devices for location 52.220781, 6.888800', function (done) {
        server.get('/api/devices?latitude=52.220781&longitude=6.888800')
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var devices = res.body.devices;
                devices.length.should.be.exactly(3);

                done();
            });
    });

    it('should return a list of 1 device for location 52.1977283, 6.8562263', function (done) {
        server.get('/api/devices?latitude=52.1977283&longitude=6.8562263&distance=1')
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var devices = res.body.devices;
                devices.length.should.be.exactly(1);
                devices[0].application_id.should.be.exactly('123');
                devices[0].device_id.should.be.exactly('002');
                devices[0].location.should.be.eql([52.1977283, 6.8562263]);
                should.not.exist(devices[0].type);
                should.not.exist(devices[0].geometry);
                
                done();
            });
    });

    it('should return a list of 1 device for location 52.1977283, 6.8562263 in geojson format', function (done) {
        server.get('/api/devices?latitude=52.1977283&longitude=6.8562263&distance=1&geojson')
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var devices = res.body.devices;
                devices.length.should.be.exactly(1);
                devices[0].application_id.should.be.exactly('123');
                devices[0].device_id.should.be.exactly('002');
                should.not.exist(devices[0].location);
                devices[0].type.should.be.exactly('Feature');
                devices[0].geometry.type.should.be.exactly('Point');
                devices[0].geometry.coordinates.should.be.eql([6.8562263,52.1977283]);

                done();
            });
    });

    it('should return a list of 2 devices for location 52.220781, 6.888800', function (done) {
        server.get('/api/devices?latitude=52.220781&longitude=6.888800&distance=1')
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var devices = res.body.devices;
                devices.length.should.be.exactly(2);

                done();
            });
    });

    it('should return a list of 4 devices for location 52.220781, 6.888800', function (done) {
        server.get('/api/devices?latitude=52.220781&longitude=6.888800&distance=250')
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var devices = res.body.devices;
                devices.length.should.be.exactly(4);

                done();
            });
    });
});