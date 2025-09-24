const app = require('./src/app');
const connectDB = require('./src/config/database');
const swaggerDocs = require('./swagger');

const PORT = process.env.PORT || 5000;

// Connect to DB before starting server
(async () => {
  try {
    await connectDB(); 
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    swaggerDocs(app, PORT);
  } catch (error) {
    console.error('Failed to connect to MongoDB, exiting...');
    process.exit(1); // exit the process if DB fails
  }
})();
