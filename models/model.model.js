const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    base_image: { type: String, required: true},
    mask_image: { type: String, required: true}
})

module.exports = Model = mongoose.model("models", modelSchema);