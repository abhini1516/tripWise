const Trip = require("../models/trip");

// Create a new trip
const createTrip = async (req, res) => {
  try {
    console.log("🔹 Request Body:", req.body);
    console.log("🔹 User in Request:", req.user); // Debugging: Check if req.user exists

    const { title, destinations, startDate, endDate, budget, activities, notes } = req.body;

    if (!title || !destinations || !startDate || !endDate || !budget) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!req.user || !req.user.userId) {
      console.log("⚠️ User is missing in request!");
      return res.status(401).json({ success: false, message: "Unauthorized: User not found in request" });
    }

    const newTrip = new Trip({
      user: req.user.userId, // Ensure user is properly assigned
      title,
      destinations,
      startDate,
      endDate,
      budget,
      activities,
      notes,
    });

    console.log("✅ Saving new trip:", newTrip);
    await newTrip.save();
    res.status(201).json({ success: true, trip: newTrip });

  } catch (error) {
    console.error("❌ Error in createTrip:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};



// Get all trips
const getAllTrips = async (req, res) => {
  try {
    let { page, limit, startDate, endDate, budget, title } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (budget) {
      filter.budget = { $lte: parseInt(budget) };
    }

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const trips = await Trip.find(filter).skip(skip).limit(limit);
    const totalTrips = await Trip.countDocuments(filter);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalTrips / limit),
      totalTrips,
      trips,
    });
  } catch (error) {
    console.error("Error fetching trips:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a single trip
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    res.status(200).json({ success: true, trip });
  } catch (error) {
    console.error("Error in getTripById:", error.message);
    res.status(500).json({ success: false, message: "Unable to fetch trip" });
  }
};

// Update a trip
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    res.status(200).json({ success: true, trip });
  } catch (error) {
    console.error("Error in updateTrip:", error.message);
    res.status(500).json({ success: false, message: "Unable to update trip" });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    res.status(200).json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTrip:", error.message);
    res.status(500).json({ success: false, message: "Unable to delete trip" });
  }
};

// Correctly exporting functions
module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip
};
