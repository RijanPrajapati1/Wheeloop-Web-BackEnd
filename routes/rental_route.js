const express = require("express");
const { findAll, save, findUserBookings, findById, deleteById, update } = require("../controller/rental_controller");

const router = express.Router();

router.get("/findAll", findAll)
router.post("/", save)
router.get("/:id", findById)
router.delete("/:id", deleteById)
router.put("/:id", update)

router.get("/userBookings", findUserBookings); // No need to use a parameter



module.exports = router;