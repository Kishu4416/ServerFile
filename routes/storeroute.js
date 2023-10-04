const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const Store = mongoose.model("Store");

router.post("/stores", async (req, resp) => {
  try {
    const { name, address, timing, longitude, latitude } = req.query; // Extract data from query parameters

    if (!name || !address || !timing || !longitude || !latitude) {
      // Check if any required field is missing
      return resp.status(400).send("All fields are required.");
    }

    const store = new Store({
      name,
      address,
      timing,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    const storeData = await store.save();
    resp
      .status(200)
      .send({ success: true, msg: "Store Data", data: storeData });
  } catch (error) {
    resp.status(400).send(error.message);
  }
});

router.get(`/stores`, async (req, resp) => {
  const storeList = await Store.find();

  if (!storeList) {
    resp.status(500).json({ success: false });
  }
  resp.send(storeList);
});

module.exports = router;
