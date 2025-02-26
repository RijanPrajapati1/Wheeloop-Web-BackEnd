const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
