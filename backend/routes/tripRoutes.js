const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("Trip Routes Loaded");
console.log("Trip Controller:", tripController);

// Create a new trip
router.post("/add", authMiddleware, tripController.createTrip);

// Get all trips
router.get("/my-trips", authMiddleware, tripController.getAllTrips);

// Get a single trip by ID
router.get("/:id", tripController.getTripById);

// Update a trip
router.put("/:id", authMiddleware, tripController.updateTrip);

// Delete a trip
router.delete("/:id", authMiddleware, tripController.deleteTrip);

module.exports = router;
