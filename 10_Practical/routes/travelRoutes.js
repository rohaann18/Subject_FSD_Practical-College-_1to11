const express = require('express');
const {
  createTravel,
  getTravels,
  getTravelById,
  updateTravel,
  deleteTravel
} = require('../controllers/travelController');

const router = express.Router();

router.post('/', createTravel);
router.get('/', getTravels);
router.get('/:id', getTravelById);
router.put('/:id', updateTravel);
router.delete('/:id', deleteTravel);

module.exports = router;
