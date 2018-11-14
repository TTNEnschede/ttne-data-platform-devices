const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
  // Owner api key.
    api_key: { type: String, required: true },
    // Application id.
    application_id: { type: String, required: true },
    // Device's id.
    device_id: { type: String, required: true },
    // Sensors on the device.
    sensors: { type: [String] },
    // Location for stationary devices.
    location: {type: [Number], index: '2dsphere'},
    // Same location information but in GeoJSON format.
    type: { type: String, default: 'Feature'},
    geometry: {
        type: { type: String, default: 'Point' },
        coordinates: {type: [Number], index: '2dsphere'}
    },
    // Properties are required for GeoJSON (store the device id here).
    properties: {
      name: { type: String }
    }
},
{
	// Timestamping on create and update.
	timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }
})

module.exports = mongoose.model("Device", deviceSchema)
