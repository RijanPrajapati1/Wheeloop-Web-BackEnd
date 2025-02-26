const express = require("express");
const { submitRating, getCarRatings, getUserCarRating } = require("../controller/rating_controller");
const router = express.Router();

// Submit or update rating
router.post("/submit", submitRating);

// t average rating & total ratings for a car
router.get("/:carId", getCarRatings);

// Get a user's rating for a specific car
router.get("/user/:userId/car/:carId", getUserCarRating);

module.exports = router;
