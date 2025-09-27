// src/config/swaggerDocs.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookly API',
      version: '1.0.0',
      description: 'Auto-generated API documentation',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://express-bookly.vercel.app/api'
            : `http://localhost:${PORT}/api`,
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  // Paths to files containing JSDoc comments
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Serve swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve UI with proper asset handling
  app.use(
    '/api-docs',
    swaggerUi.serveFiles(swaggerSpec, {}),
    swaggerUi.setup(swaggerSpec)
  );

  console.log('📄 Swagger docs available at /api-docs');
};

module.exports = swaggerDocs;
