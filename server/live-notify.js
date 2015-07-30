
const Q = require("q");
const PG = require("pg");
const SOCKETIO = require("socket.io");
const DB = require("./db/bookshelf.knex.postgresql");


var sockets = {
	bySocketId: {},
	byContextId: {}
};

exports.attachToClientServer = function (server) {

	var io = SOCKETIO(server);

	io.on("error", function (err) {
		console.error("Socket.IO Error:", err.stack);
	});

	io.on('connection', function (socket) {

		if (!server._FireNodeContext.attachToSocket(socket)) {
			return false;
		}

		socket.on('context', function (context) {

			if (!socket._FireNodeContext.attachToMessage(context)) {
				return;
			}

console.log("Register new context", context);

			sockets.bySocketId[socket.id] = socket;

			if (!sockets.byContextId[context.id]) {
				sockets.byContextId[context.id]= {};
			}
			sockets.byContextId[context.id][socket.id] = socket;

			socket.on('disconnect', function() {
				delete sockets.bySocketId[socket.id];
				if (sockets.byContextId[context.id]) {
					delete sockets.byContextId[context.id][socket.id];
					if (Object.keys(sockets.byContextId[context.id]).length === 0) {
						delete sockets.byContextId[context.id];
					}
				}
			});
		});
	});

	return Q.resolve();
}

exports.attachToDatabase = function (connectionConfig) {

	var deferred = Q.defer();

	// TODO: Implement re-connect.
	PG.connect(connectionConfig, function(err, client, done) {
		if (err) return deferred.reject(err);

		// Broadcast DB modifications to connected clients.

		client.on('notification', function(msg) {
			if (msg.name === 'notification') {
				if (msg.channel === "order_status_changed") {
					var payload = msg.payload.split(",");
console.log("payload", payload);
					return DB.getKnex()('order-status').where({
						"id": payload[2]
					}).select('id', 'orderHashId').then(function (result) {

						var orderHashId = result[0].orderHashId;
console.log("orderHashId", orderHashId);

						return DB.getKnex()('orders').where({
							"orderHashId": orderHashId
						}).select('id', 'vendor_ids').then(function (result) {

							var vendor_ids = result[0].vendor_ids.split(",");
console.log("vendor_ids", vendor_ids);

							return DB.getKnex()('vendors').whereIn("id", vendor_ids).select('id', 'adminAccessToken').then(function (result) {

								result.forEach(function (result) {

									var adminAccessToken = result.adminAccessToken;
console.log("adminAccessToken", adminAccessToken);

									exports.notify({
										id: adminAccessToken
									}, {
										collection: "order-status",
										orderHashId: orderHashId
									});
								});
							});
						});

					}).catch(function (err) {
				    	console.error("Error fetching order status info:", err.stack);
					});
				}
			}
		});

		var query = client.query("LISTEN order_status_changed");
		// We don't care about result as we are just registering a listener.

		// NOTW: We are NOT calling 'done()' on purpose as we want to keep listening!
		// done();
		return deferred.resolve();
	});

	return deferred.promise;
}



exports.notify = function (context, message) {

	return Q.fcall(function () {

		if (!sockets.byContextId[context.id]) return;

console.log("Send message to clients", message);

		Object.keys(sockets.byContextId[context.id]).forEach(function (id) {
			sockets.byContextId[context.id][id].emit("notify", message);
		});
	});

}

