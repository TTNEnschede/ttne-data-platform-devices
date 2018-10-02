'use strict'

module.exports = {
    name: 'ttne-data-platform',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    service: {
        port: process.env.DEVICES_SERVICE_PORT || 3002,
        base_url: process.env.DEVICES_SERVICE_BASE_URL || 'http://localhost'
    },
    db: {
        uri: process.env.DEVICES_DB_URI || 'mongodb://127.0.0.1:27017/ttne_data'
    },
    mqtt: {
        enabled: process.env.DEVICES_MQTT_ENABLED || false,
        broker_url: process.env.DEVICES_MQTT_BROKER_URL || 'mqtt://localhost',
        ingest_topic: process.env.INGEST_MQTT_INGEST_TOPIC || 'ingest',
        mqtt_payload_topic: process.env.MQTT_PAYLOAD_TOPIC || '/devices/%s/payload',
        qos: process.env.DEVICES_MQTT_QOS || 1
    }
}
