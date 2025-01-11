const express = require("express");
const { findAll, save, findById, deleteById, update } = require("../controller/car_controller");



const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'car_images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })


router.get("/", findAll)
router.post("/", upload.single('file'), save)
router.get("/:id", findById)
router.delete("/:id", deleteById)
router.put("/:id", update)


module.exports = router;