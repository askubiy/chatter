var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roomSchema = new Schema({
    name: {
        type: String,
        maxlength: [30, "Name should be 30 chars max"],
        minlength: [3, "Name too short 3 chars minimum"],
        required:  [true, "Room name can't be empty"]
    },
    users: { type: Array, "default": [] },
    messages: { type: Array, "default": [] },
});


module.exports = mongoose.model("Room", roomSchema);
