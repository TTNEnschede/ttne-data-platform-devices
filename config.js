'use strict'

module.exports = {
    name: 'ttne-data-platform',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3002,
    base_url: process.env.BASE_URL || 'http://localhost:3002',
    mqtt_broker_url: process.env.MQTT_BROKER || 'mqtt://localhost',
    mqtt_client_id: process.env.MQTT_CLIENT_ID || 'ttne-processor-client',
    mqtt_ingest_topic: process.env.MQTT_INGEST_TOPIC || 'ingest',
    mqtt_payload_topic: process.env.MQTT_PAYLOAD_TOPIC || '/devices/%s/payload',
    db: {
        uri: 'mongodb://127.0.0.1:27017/ttne_data'
    }
}