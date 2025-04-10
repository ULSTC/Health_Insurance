// routes/intermediaryRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getIntermediaries,
  getIntermediaryById,
  getIntermediaryByCode,
  createIntermediary,
  updateIntermediary,
  deleteIntermediary
} = require('../controllers/Intermediary.controller'); // Adjust the path as necessary
 // Assuming you have auth middleware

// Routes
router.route('/')
  .get(getIntermediaries)
  .post( createIntermediary);

// Get intermediary by code route (must be before /:id route to avoid conflicts)
router.route('/code/:code')
  .get(getIntermediaryByCode);

router.route('/:id')
  .get(getIntermediaryById)
  .put( updateIntermediary)
  .delete( deleteIntermediary);

module.exports = router;