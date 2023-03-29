const mongoose = require('mongoose');
const AniSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    plot: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created: {
        type: String,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("animation", AniSchema);