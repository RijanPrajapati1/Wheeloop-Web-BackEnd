const express = require("express");
const { findAll, save, findById, deleteById, update } = require("../controller/car_controller");
const { authenticateToken, authorizeRole } = require("../security/auth");

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
router.post("/",
    //  authenticateToken, authorizeRole("admin"), 
    upload.single('file'), save)
router.get("/:id", authenticateToken, authorizeRole("admin"), findById)
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteById)
router.put("/:id", authenticateToken, authorizeRole("admin"), update)


module.exports = router;