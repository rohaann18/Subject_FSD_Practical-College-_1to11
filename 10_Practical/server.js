const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const travelRoutes = require('./routes/travelRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB.
connectDB();

// Middleware to read JSON and form data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from the public folder.
app.use(express.static('public'));

// Simple route used to check whether the API is running.
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Travel Log API is running'
  });
});

// Travel CRUD routes.
app.use('/api/travels', travelRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
