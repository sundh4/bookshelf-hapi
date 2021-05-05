// Import all modules needed
const Hapi = require('@hapi/hapi');
const routes = require('./app/routes/routes');

// Init server
const init = async () => {
  const server = Hapi.server({
    // Add port number
    port: 5000,
    // Add host
    host: 'localhost',
    // Apply CORS globally to all routes. set it to wildcard '*'
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

// Start server
init();
