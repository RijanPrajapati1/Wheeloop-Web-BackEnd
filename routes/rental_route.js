const express = require("express");
const { findAll, save, findUserBookings, findById, deleteById, update, getAdminBookings, updateBooking, deleteBooking, processPayment } = require("../controller/rental_controller");

const router = express.Router();

router.get("/findAll", findAll)
router.get("/userBookings", findUserBookings);
router.get("/adminBookings", getAdminBookings);
router.put("/updateBooking/:id", updateBooking);
router.delete("/deleteBooking/:id", deleteBooking);

router.post("/processPayment", processPayment);

router.post("/", save)
router.get("/:id", findById)
router.delete("/:id", deleteById)
router.put("/:id", update)





module.exports = router;