// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookly API',
      version: '1.0.0',
      description: 'Auto-generated API documentation',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
    // no hardcoded servers here; will be dynamic
  },
  apis: ['./src/routes/*.js'], // path to your route files with JSDoc
};

// Generate Swagger spec
const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Serve raw JSON
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      explorer: true,
      swaggerOptions: {
        url: '/swagger.json', // <-- point UI to JSON endpoint
      },
    })
  );

  console.log('📄 Swagger docs available at /api-docs');
};

module.exports = swaggerDocs;
