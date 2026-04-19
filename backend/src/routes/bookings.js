const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

// GET /api/bookings - Fetch all bookings with associated Resource (eager loading)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: Resource }],
      order: [['booking_date', 'ASC']],
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const { resource_id, requested_by, booking_date } = req.body;

    if (!resource_id || !requested_by || !booking_date) {
      return res.status(400).json({
        success: false,
        message: 'resource_id, requested_by, and booking_date are required.',
      });
    }

    // Check if resource exists
    const resource = await Resource.findByPk(resource_id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    // Allow only one booking per resource until it is cancelled.
    const existingBooking = await Booking.findOne({
      where: {
        resource_id,
      },
      order: [['createdAt', 'DESC']],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `Resource "${resource.name}" is already booked and will be available only after cancellation.`,
      });
    }

    const booking = await Booking.create({ resource_id, requested_by, booking_date });
    const bookingWithResource = await Booking.findByPk(booking.id, {
      include: [{ model: Resource }],
    });

    res.status(201).json({ success: true, data: bookingWithResource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/bookings/:id - Cancel/Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    await booking.destroy();
    res.json({ success: true, message: 'Booking cancelled successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
