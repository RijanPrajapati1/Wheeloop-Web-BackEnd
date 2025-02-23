
const Car = require("../model/car")


const findAll = async (req, res) => {
    try {
        const cars = await Car.find();

        // Modify image field to include the full URL
        const carsWithImages = cars.map(car => ({
            ...car._doc,
            image: `http://localhost:3001/car_images/${car.image}`
        }));

        res.status(200).json(carsWithImages);
    } catch (e) {
        res.status(500).json(e);
    }
};


const save = async (req, res) => {
    try {
        const { name, type, price, description, transmission } = req.body;
        const car = new Car({
            name,
            type,
            price,
            description,
            transmission,
            image: req.file.filename // Store just filename
        });
        await car.save();
        res.status(201).json(car);
    } catch (e) {
        res.status(500).json(e);
    }
};

const findById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: "Car not found" });

        // Append full URL to the image
        const carWithImage = {
            ...car._doc,
            image: `http://localhost:3001/car_images/${car.image}`
        };

        res.status(200).json(carWithImage);
    } catch (e) {
        res.status(500).json(e);
    }
};


const deleteById = async (req, res) => {
    try {
        const cars = await Car.findByIdAndDelete(req.params.id);
        res.status(200).json("Data Deleted")
    } catch (e) {
        res.status(500).json(e)
    }
}

const update = async (req, res) => {
    try {
        const cars = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json(cars)
    } catch (e) {
        res.status(500).json(e)
    }
}


module.exports = {
    findAll,
    save,
    findById,
    deleteById,
    update
}