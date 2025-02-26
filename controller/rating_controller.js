const Rating = require("../model/rating");
// Submit or update a rating
const submitRating = async (req, res) => {
    try {
        const { userId, carId, value } = req.body;

        // Check if the user already rated this car
        const existingRating = await Rating.findOne({ userId, carId });

        if (existingRating) {
            existingRating.value = value; // Update the rating value
            await existingRating.save();
            return res.status(200).json({ message: "Rating updated successfully." });
        }

        // Create a new rating
        const newRating = new Rating({ userId, carId, value });
        await newRating.save();
        return res.status(201).json({ message: "Rating submitted successfully." });

    } catch (error) {
        res.status(500).json({ message: "Error submitting rating.", error: error.message });
    }
};

// Get average rating & total ratings for a car
const getCarRatings = async (req, res) => {
    try {
        const { carId } = req.params;
        const ratings = await Rating.find({ carId });

        if (!ratings.length) {
            return res.status(404).json({ message: "No ratings available for this car." });
        }

        // Calculate average rating
        const totalRatings = ratings.length;
        const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
        const averageRating = (sum / totalRatings).toFixed(1);

        res.status(200).json({ averageRating, totalRatings });

    } catch (error) {
        res.status(500).json({ message: "Error fetching car ratings.", error: error.message });
    }
};

// Get a user's rating for a specific car
const getUserCarRating = async (req, res) => {
    try {
        const { userId, carId } = req.params;
        const rating = await Rating.findOne({ userId, carId });

        if (!rating) {
            return res.status(404).json({ message: "No rating found for this user and car." });
        }

        res.status(200).json({ value: rating.value });

    } catch (error) {
        res.status(500).json({ message: "Error fetching user rating.", error: error.message });
    }
};

module.exports = { submitRating, getCarRatings, getUserCarRating };
