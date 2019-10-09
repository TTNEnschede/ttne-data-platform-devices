# TTNE Data Platform Devices
The devices service of the data platform for storing and retrieving devices which have been added to the data platform.

# Features
This repository contains a REST service which contains a GET endpoint for retrieving devices stored in the platform. Data is processed from data received from the ingest service and is stored in a mongo database. Optionally the playload data can be (re)published to a (local) MQTT broker for further processing.

# Run
Start the service using npm start (from the command line). Be sure to install the required packages first by running npm install.

```
npm install
npm start
```

# Configuration
The service can be configure with the following environment variables:
```
DEVICES_LOGFILE_ENABLED: Configures whether logging is enabled (default = false)
DEVICES_LOGFILE_PATH: If DEVICES_LOGFILE_ENABLED is set to true, configures the path where to store the logs (default = '/tmp/ttne-data-platform.log')
DEVICES_SERVICE_PORT: The HTTP port on which the service listens (default = 3002)
DEVICES_SERVICE_BASE_URL: The base url on which the server listens (default = 'http://localhost')
DEVICES_DB_URI: The (Mongo) database in which to store and retrieve data (default = 'mongodb://127.0.0.1:27017/ttne_data')
DEVICES_MQTT_ENABLED: Whether the service should connect to an MQTT broker (default = false)
DEVICES_MQTT_BROKER_URL: If DEVICES_MQTT_ENABLED is set to true, this variable tells the service where to connect to the MQTT broker (default = 'mqtt://localhost')
INGEST_MQTT_INGEST_TOPIC: If DEVICES_MQTT_ENABLED is set to true, this variable tells the service on which topic to subscribe at the MQTT broker (default = 'ingest')
MQTT_PAYLOAD_TOPIC: If DEVICES_MQTT_ENABLED is set to true, this variable tells the service on which topic to publish at the MQTT broker (default = '/devices/%s/payload')
DEVICES_MQTT_QOS: If DEVICES_MQTT_ENABLED is set to true, this variable tells the service which Quality of Service level to use when connecting to the MQTT broker. Valid options are 1, 2 or 3 (default = 1)
```

See config.js for configuration parameters.

Application supports [dotenv](https://www.npmjs.com/package/dotenv "NPM dotenv package"). Add environment variables in a '.env' file in the root folder and they will be
picked up by the application.
