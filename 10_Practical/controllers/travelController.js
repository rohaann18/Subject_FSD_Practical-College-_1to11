const mongoose = require('mongoose');
const Travel = require('../models/Travel');

// Create a new travel experience.
const createTravel = async (req, res) => {
  try {
    const travel = await Travel.create({
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      travelDate: req.body.travelDate,
      imageUrl: req.body.imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Travel experience created successfully',
      data: travel
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid travel details'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Unable to create travel experience'
    });
  }
};

// Get all travel experiences, newest first.
const getTravels = async (req, res) => {
  try {
    const travels = await Travel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: travels.length,
      data: travels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch travel experiences'
    });
  }
};

// Get one travel experience by its MongoDB ID.
const getTravelById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid travel ID'
      });
    }

    const travel = await Travel.findById(req.params.id);

    if (!travel) {
      return res.status(404).json({
        success: false,
        message: 'Travel experience not found'
      });
    }

    res.status(200).json({
      success: true,
      data: travel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch travel experience'
    });
  }
};

// Update an existing travel experience.
const updateTravel = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid travel ID'
      });
    }

    const allowedFields = [
      'title',
      'location',
      'description',
      'travelDate',
      'imageUrl'
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const travel = await Travel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!travel) {
      return res.status(404).json({
        success: false,
        message: 'Travel experience not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Travel experience updated successfully',
      data: travel
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid travel details'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Unable to update travel experience'
    });
  }
};

// Delete a travel experience.
const deleteTravel = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid travel ID'
      });
    }

    const travel = await Travel.findByIdAndDelete(req.params.id);

    if (!travel) {
      return res.status(404).json({
        success: false,
        message: 'Travel experience not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Travel experience deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to delete travel experience'
    });
  }
};

module.exports = {
  createTravel,
  getTravels,
  getTravelById,
  updateTravel,
  deleteTravel
};
