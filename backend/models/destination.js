const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    name: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
