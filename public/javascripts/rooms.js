$(function() {
    var socket = io();
    
    socket.on('roomListInfoUdate', function(roomListInfo) {
        updateRoomList(roomListInfo);
    });
    
    socket.emit("getRoomlistInfo");
    
    function updateRoomList(roomListInfo) {
        $.each(roomListInfo, function(index, room){
            $("#" + room.roomId).text(room.usersCount);
        });
    }
});
