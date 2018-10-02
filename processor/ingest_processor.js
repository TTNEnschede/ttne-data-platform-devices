'use strict'

const config    = require('./../config');
const util      = require('util');
const Device    = require('./../models/Device');

module.exports.process_ingest_message = function(ingest) {

    // Known issue: A device app_id and dev_id should be globally unique. If this is not the case (we don't check or enforce this)
    // then ingest with an account for an existing app_id and dev_id pair (associated with a different account) will not result in
    // the creation and storage of a new device. Ownership of this device will remain with the previous account.

    // First check if we have seen the device before.
    Device.findOne({application_id: ingest.payload.app_id, device_id: ingest.payload.dev_id}, function(err, device){
        if (err) {
            log.error('Error retrieving device for api key: ', err);
            return;
        }

        // This is a new device.
        // Let's add it to the database.
        if (!device) {
            // Create new device
            var newDevice = new Device({
                api_key: ingest.api_key,
                application_id: ingest.payload.app_id,
                device_id: ingest.payload.dev_id,
                sensors: Object.keys(ingest.payload.payload_fields)
            });

            // If the device has a static location then we should get it from the metadata.
            if (ingest.payload.metadata !== undefined &&
                ingest.payload.metadata.latitude !== undefined &&
                ingest.payload.metadata.longitude !== undefined ) {
                // Store location.
                newDevice.location = [ingest.payload.metadata.latitude, ingest.payload.metadata.longitude];
                // Store same location in GeoJSON format.
                // Note: the GeoJSON coordinates are in reverse order (according to the sepcification).
                newDevice.geometry = {};
                newDevice.geometry.type = 'Point';
                newDevice.geometry.coordinates = [ingest.payload.metadata.longitude, ingest.payload.metadata.latitude];
            }

            // Save it.
            newDevice.save(function (err) {
                if (err) {
                    log.error('Cannot create a new device: ', err);
                    return;
                }

	            // Publish payload_fields to MQTT broker for further processing.
    	        return publish_payload(ingest);
            });

        } else {
            // This is an existing device.
            // Check if device has some new sensors.
            var sensors = deduplicateArray(Object.keys(ingest.payload.payload_fields).concat(device.sensors));
            if (device.sensors.length < sensors.length) {
                // Update device.
                device.sensors = sensors;
                device.save(function (err) {
                    if (err) {
                        log.error('Cannot update device: ', err);
                        return;
                    }
                });
            }

            // Publish payload_fields to MQTT broker for further processing.
            return publish_payload(ingest);
        }

    });

};

/**
 * Publish the payload of the ingest message to the MQTT broker.
 */
function publish_payload(ingest) {

	if (ingest.payload.payload_fields !== undefined) {
        // Publish payload_fields to MQTT broker for further processing.
      	mqtt_client.publish(
      		util.format(config.mqtt.mqtt_payload_topic, ingest._id),
      		JSON.stringify(ingest.payload.payload_fields)
      	);
    }
};

/**
 * Removes duplicates from the supplied array.
 */
function deduplicateArray(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
