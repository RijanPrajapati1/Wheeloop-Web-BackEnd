
const Car = require("../model/car")


const findAll = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (e) {
        res.status(500).json(e)
    }
}


const save = async (req, res) => {
    try {
        const { name, type, price, description, transmission } = req.body
        const cars = new Car({
            name,
            type,
            price,
            description,
            transmission,
            image: req.file.originalname
        });
        await cars.save()
        res.status(201).json(cars)
    } catch (e) {
        res.status(500).json(e)
    }
}

const findById = async (req, res) => {
    try {
        const cars = await Car.findById(req.params.id);
        res.status(200).json(cars)
    } catch (e) {
        res.status(500).json(e)
    }
}


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