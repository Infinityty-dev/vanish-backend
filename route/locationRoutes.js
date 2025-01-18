const express = require('express');
const Location = require('../models/Location');
const router = express.Router();

// GET Location Details
router.get('/details', async (req, res) => {
  try {
    const location = await Location.findOne(); // Fetch a single location record
    if (!location) {
      return res.status(404).json({ message: 'No location details found.' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location details', error });
  }
});

// POST Update Services
router.post('/update-services', async (req, res) => {
  try {
    const { services } = req.body;

    const location = await Location.findOneAndUpdate(
      {}, // Update the first record (add conditions if needed)
      { services },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({ message: 'Location not found for update.' });
    }

    res.status(200).json({ message: 'Services updated successfully', location });
  } catch (error) {
    res.status(500).json({ message: 'Error updating services', error });
  }
});

module.exports = router;
