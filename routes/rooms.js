var express = require('express');
var passport = require('passport');
var router = express.Router();
var Room = require('../models/room');

/* GET rooms listing. */
router.get("/", function(req, res, next) {
    if (req.user) {
        Room.find(function (err, rooms) {
            if (err) return console.error(err);
            res.render("rooms", { user: req.user, rooms: rooms });
        });
    } else {
        res.redirect("/");
    }

});

/* POST create room */
router.post("/", function(req, res, next) {
    var roomName = req.body.roomName;
    
    var newRoom = new Room({
        name: roomName
    });
    
    var error = newRoom.validateSync();
    if (error) {
        var rooms = [];
        var errorMessages = error.errors;
        Room.find(function (err, rooms) {
            roomName = req.body.roomName;
            res.render("rooms", { 
                user: req.user,
                roomName: roomName,
                newRoomErrors: errorMessages,
                rooms: rooms
            });
        });
    } else {
        newRoom.save(function (err, newRoom) {
            if (err) return console.error(err);
        });
        res.redirect("/rooms")
    }

});

/* GET room */
router.get("/:roomId", function(req, res, next) {
    if (req.user) {
        Room.findOne({ _id: req.params.roomId }, function (err, room) {
            if (err) return console.error(err);
            if (room) {
                res.render("room", { user: req.user, room: room });
            } else {
                res.redirect("/rooms");
            }
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router;
