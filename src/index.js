#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("./app");
// var debug = require("debug")("myapp:server");
var http = require("http");
// const pm2 = require('pm2');
/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT;
// console.log(process.env.PORT);
app.set("port", port);
// pusing

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  const serverAddress = server.address();
  console.log(`app is running on port ${serverAddress.port}`);
});
// server.on("error", onError);
// server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      // console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
//   debug("Listening on " + bind);
// }

// pm2.connect(function (err) {
//   if (err) {
//     console.error(err);
//     process.exit(2);
//   }

//   pm2.start({
//     name: 'myapp',
//     script: '/',
//     exec_mode: 'cluster',
//     instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
//     max_memory_restart: '1G',
//     autorestart: true,
//     watch: false,
//     env: {
//       NODE_ENV: process.env.NODE_ENV || 'development',
//       PORT: port
//     }
//   }, function (err, apps) {
//     pm2.disconnect();   // Disconnect from PM2
//     if (err) throw err;
//   });
// });
