const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Jobs API Documentation',
    description: 'Details about the BE API we use to manage snapscams. ',
  },
  host: 'localhost:3050',
  schemes: ['http'],
  components: {
    securitySchemes: {
      basicAuth: {
        type:   'http',
        scheme: 'basic'
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/routes.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index.js'); // Your project's root file
});