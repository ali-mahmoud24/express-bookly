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
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

  // Expose raw JSON spec (for debugging Swagger UI issues)
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📄 Swagger docs ready. Local: http://localhost:${PORT}/api-docs`);
};

module.exports = swaggerDocs;
