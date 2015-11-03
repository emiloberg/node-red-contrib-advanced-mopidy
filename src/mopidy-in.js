import servers from './lib/models/servers';
var objectPath = require('object-path');

module.exports = function(RED) {
    'use strict';
    function mopidyInNode(n) {

        this.RED = RED;
        this.servers = servers;

        this.RED.nodes.createNode(this,n);
        this.name = n.name;
        this.server = n.server;
        this.serverNode = this.RED.nodes.getNode(n.server);
		this.mopidyServer = {
			readyState: false
		};

		if (!this.serverNode) {
			return;
		}

		this.mopidyServer = this.servers.add({
			host: this.serverNode.host,
			port: this.serverNode.port
		});

		this.mopidyServer.mopidy.on((fullEventName, eventData) => {
			if (fullEventName.substr(0, 6) === 'event:') {
				eventData.event = fullEventName.substring(6, fullEventName.length);
				this.send({
					payload: eventData,
					serverName: this.serverNode.name,
					host: this.serverNode.host,
					port: this.serverNode.port
				});
			}
		});

		this.updateStatus = () => {
			if (objectPath.get(this, 'mopidyServer.readyState', false) === true) {
				this.status({ fill: 'green', shape: 'dot', text: 'connected' });
			} else {
				this.status({ fill: 'grey', shape: 'dot', text: 'not connected' });
			}
		};
		this.mopidyServer.events.on('ready:ready', this.updateStatus);
		this.mopidyServer.mopidy.on('websocket:error', this.updateStatus);
		this.updateStatus();
    }
    RED.nodes.registerType('mopidy-in', mopidyInNode);
};
