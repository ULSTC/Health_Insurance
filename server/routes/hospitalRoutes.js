// routes/hospitalRoutes.js
const express = require('express');
const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital
} = require('../controllers/hospitalController');

const router = express.Router();

// Middleware example (optional) - replace with your actual auth middleware
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getHospitals)
  .post( createHospital);

router
  .route('/:id')
  .get(getHospital)
  .put(updateHospital)
  .delete(deleteHospital);

module.exports = router;
