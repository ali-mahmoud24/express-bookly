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
    servers: [{ url: `http://localhost:${PORT}/api` }],
  },
  // Paths to files containing JSDoc comments
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app, PORT) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📄 Swagger docs available at http://localhost:${PORT}/api-docs`);
};

module.exports = swaggerDocs;
