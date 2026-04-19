const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');

const resourceRoutes = require('./routes/resources');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SpaceSync API is running!' });
});

// Sync DB and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    // Sync models (alter: true to update existing tables safely)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced.');

    // Seed initial resources if none exist
    const count = await Resource.count();
    if (count === 0) {
      await Resource.bulkCreate([
        { name: 'Networking Lab', type: 'Room', capacity: 30 },
        { name: 'Seminar Hall A', type: 'Room', capacity: 100 },
        { name: 'Library Reading Room', type: 'Room', capacity: 50 },
        { name: 'Multimedia Projector #1', type: 'Equipment', capacity: 1 },
        { name: 'Multimedia Projector #2', type: 'Equipment', capacity: 1 },
        { name: 'Computer Lab B', type: 'Room', capacity: 40 },
      ]);
      console.log('✅ Seeded 6 initial resources.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 SpaceSync server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
