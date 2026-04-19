const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// GET /api/resources - Fetch all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.findAll();
    res.json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/resources - Create a new resource
router.post('/', async (req, res) => {
  try {
    const { name, type, capacity } = req.body;
    if (!name || !type || !capacity) {
      return res.status(400).json({ success: false, message: 'name, type, and capacity are required.' });
    }
    const resource = await Resource.create({ name, type, capacity });
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
