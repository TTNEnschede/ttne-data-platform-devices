'use strict'

exports.importData = function (callback) {
	var moment = require('moment');
	var Device  = require('./../models/Device');
    
    // In Enschede
    var device_12345_001 = new Device({
        api_key: 'account_2',
        application_id: '12345',
        device_id: '001',
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [
                6.8888004, 52.2207814
            ]
        },
        location: [
            52.2207814, 6.8888004
        ]
    });
    // In Enschede
    var device_123_001 = new Device({
        api_key: 'account_1',
        application_id: '123',
        device_id: '001',
        geometry: {
            type: "Point",
            coordinates: [
                6.8888004, 52.2207814
            ]
        },
        location: [
            52.2207814, 6.8888004
        ]
    });
    // In Enschede
    var device_123_002 = new Device({
        api_key: 'account_1',
        application_id: '123',
        device_id: '002',
        geometry: {
            type: "Point",
            coordinates: [
                6.8562263, 52.1977283
            ]
        },
        location: [
            52.1977283, 6.8562263
        ]
    });
    // In Amsterdam
    var device_123_003 = new Device({
        api_key: 'account_1',
        application_id: '123',
        device_id: '003',
        geometry: {
            type: "Point",
            coordinates: [
                4.890587, 52.373225
            ]
        },
        location: [
            52.373225, 4.890587
        ]
    });

    var devices = [device_12345_001, device_123_001, device_123_002, device_123_003];

    Device.collection.insert(devices, function (err, deviceDocs) {
        if (err) {
            console.log("Error inserting devices:", err);
            callback(err);
        }

        callback(null);           
    });
};