const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  distance: { type: String, required: true },
  services: {
    packaging: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    offloading: { type: Boolean, default: false },
    arranging: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model('Location', locationSchema);
