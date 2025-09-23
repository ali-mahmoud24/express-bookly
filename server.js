const app = require('./src/app');
const connectDB = require('./src/config/database');
const swaggerDocs = require('./swagger');

// Connect to DB before starting server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
