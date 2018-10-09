# TTNE Data Platform Devices
The devices service of the data platform for storing and retrieving devices which have been added to the data platform.

# Features
This repository contains a REST service which contains a GET endpoint for retrieving devices stored in the platform. Data is processed from data received from the ingest service and is stored in a mongo database. Optionally the playload data can be (re)published to a (local) MQTT broker for further processing.

# Run
Start the service using npm start:

```$ npm start```

# Configuration
See config.js for configuration parameters.

Application supports dotenv. Add environment variables in a '.env' file in the root folder and they will be
picked up by the application.
