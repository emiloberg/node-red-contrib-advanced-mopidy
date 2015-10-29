import servers from './lib/models/servers';
var objectAssign = require('object-assign');

module.exports = function(RED) {
    'use strict';
    function mopidyOutNode(n) {

        this.RED = RED;
        this.servers = servers;

        this.RED.nodes.createNode(this,n);
        this.name = n.name;
        this.server = n.server;
        this.serverNode = this.RED.nodes.getNode(n.server);
        this.params = n.params;
        this.method = n.method;
        this.mopidyServer = {};

        if (this.serverNode) {
            this.mopidyServer = this.servers.add({
                name: this.serverNode.name,
                host: this.serverNode.host,
                port: this.serverNode.port
            });
        }

        this.on('close', () => {
            this.servers.remove({ id: this.mopidyServer.id });
        });

        // TODO: Make sure an output node only can have 1 running server at any given moment

        // TODO: Change this so that it shows connected/non-connected based on events
        //setInterval(() => {
        //    if('mopidyServer' in this) {
        //        if (this.mopidyServer.readyState) {
        //            this.status({fill: 'green', shape: 'ring', text: 'connected to ' + this.mopidyServer.name });
        //        } else {
        //            this.status({fill: 'red', shape: 'ring', text: 'not connected'});
        //        }
        //    } else {
        //        this.status({fill: 'red', shape: 'ring', text: 'not connected'});
        //    }
        //}, 1000);

        this.invokeMethod = (incomingMsg = {}) => {

            // todo guard against calling without connected mopidy

            if (typeof incomingMsg !== 'object') {
                this.send({ error: "If you send data to a Mopidy node, that data must an 'object'" });
                return;
            }

            if (incomingMsg.hasOwnProperty('error')) {
                this.send({ error: "Stopped. Incoming data has the property 'error'" });
                return;
            }

            if (incomingMsg.hasOwnProperty('method')) {
                if (typeof incomingMsg.method !== 'string') {
                    this.send({ error: "'method' must be a 'string'" });
                    return;
                }
            }

            if (incomingMsg.hasOwnProperty('params')) {
                if (typeof incomingMsg.params !== 'object') {
                    this.send({ error: "'params' must be an 'object'" });
                    return;
                }
            }

            let method = incomingMsg.method || this.method;
            let params = this.params || '{}';
            params = JSON.parse(params);
            let incomingParams = incomingMsg.params || {};
            objectAssign(params, incomingParams);

            this.mopidyServer.invokeMethod({ method, params})
                .then((ret) => {
                    this.send({ mopidy: ret });
                })
                .catch((err) => {
                    this.send({ error: err });
                    // todo, add error logging
                });
        };

        this.on('input', (incomingMsg) => {
            this.invokeMethod(incomingMsg);
        });

        this.routeMethods = (req, res) => {
            let tempServerNode = this.RED.nodes.getNode(req.params.nodeId);

            if (tempServerNode === undefined) {
                res.status(404).json({
                    message: 'Could not connect to Mopidy. If new connection - deploy configuration before continuing'
                });
                return;
            }

            let mopidyServer = this.servers.add({
                name: tempServerNode.name,
                host: tempServerNode.host,
                port: tempServerNode.port,
                addWithUniqueId: true
            });

            mopidyServer.getMethods()
                .then(methods => {
                    res.status(200).json(methods);
                })
                .catch(err => {
                    res.status(500).json({
                        message: err.message
                    });
                })
                .then(() => {
                    this.servers.remove({ id: mopidyServer.id })
                });
        };

        this.RED.httpAdmin.get('/mopidy/:nodeId/methods', (req, res) => {
            this.routeMethods(req, res);
        });
    }
    RED.nodes.registerType('mopidy-out', mopidyOutNode);
};
