const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    music: {
        type: String,
        required: true
    },
    points: {
        type: String,
        requred: true
    }
});

// Create collection Collection and add schema

const Vote = mongoose.model("Vote", VoteSchema);

module.exports = Vote;
