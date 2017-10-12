'use strict'

const config        = require('./config');
const restify       = require('restify');
const bunyan        = require('bunyan');
const mongoose      = require('mongoose');
const mqtt          = require('mqtt');

const processor     = require('./processor/ingest_processor');
const devicesRouter = require('./routes/devices');

// Create logger.
global.log = new bunyan({name: config.name});

// Initialize REST server.
global.server = restify.createServer({
    name    : config.name,
    version : config.version,
    log     : log
});

// Plugins.
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
if (config.env === 'development') {
    // Enable CORS for development.
    server.use(
        function crossOrigin(req,res,next){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            return next();
        }
    );
}
// Callback for exception flows (500 internal error).
server.on('uncaughtException', function(req, res, route, err) {
  var auditer = restify.auditLogger({log:log});
  auditer(req, res, route, err);
  res.send(500, "Unexpected error occured");
});

// Launch server.
server.listen(config.port, function() {

    // Set bluebird promise model.
    mongoose.Promise = require('bluebird');
    
    // Callback on connection open.
    mongoose.connection.on('open', function(err) {
        if (err) {
            log.error('Mongoose connection error: ' + err);
            process.exit(1);
        }

        // Create (persistent) MQTT client.
        global.mqtt_client  = mqtt.connect(
            config.mqtt_broker_url,
            {
                clean : false,
                clientId : config.mqtt_client_id
            }
        );
        
        // Callback methods for mqtt connection.
        mqtt_client.on('connect', function () {
            log.info('Connecting to mqtt broker %s .', config.mqtt_broker_url);
            
            // Subscribe to topic.
            mqtt_client.subscribe(config.mqtt_ingest_topic, { qos: 1 });
        });

        mqtt_client.on('message', function (topic, message) {   
            log.info('* Received message op topic ', topic);

            // Process ingest message.
            processor.process_ingest_message(JSON.parse(message.toString()));
        })

        mqtt_client.on('offline', function () {
            log.info('Disconnected to mqtt broker %s .', config.mqtt_broker_url);
        });

        mqtt_client.on('error', function (error) {
            log.error('Received error (%o) from mqtt broker.', error);
        });
   
        // Apply available routes.
        devicesRouter.applyRoutes(server, '/api');

        // Set the home route.
        server.get('/', function(req, res, next) {
            res.send({message:'Device processor service for the TTNE data platform.'});
            next();
        });

    });

    // Connect to database.
    global.db = mongoose.connect(config.db.uri, {
    	useMongoClient: true,
    });

});
