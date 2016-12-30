$(function() {
    var socket = io();
    var roomConnectionData = {
        userName: userName,
        roomId: roomId
    }
    
    if (roomHistory && roomHistory.length > 0) {
        for (var i = 0; i < roomHistory.length; i++) {
            displayMessage(roomHistory[i], 0);
        }
    }
    
    socket.on('connect', function() {
        // Connected, let's sign-up for to receive messages for this room
        socket.emit('roomConnect', roomConnectionData);
        
        var delivery = new Delivery(socket);
 
        delivery.on('delivery.connect',function(delivery){
            $("#file-send").click(function(evt){
                var file = $("input[type=file]")[0].files[0];
                var extraParams = {
                    roomId: roomConnectionData.roomId,
                    userName: roomConnectionData.userName,
                };
                delivery.send(file, extraParams);
                $("input[type=file]").val("");
                evt.preventDefault();
            });
        });
 
        delivery.on('send.success',function(fileUID){});
    });
    
    socket.on('message', function(data) {
        displayMessage(data, 500);
    });
    
    socket.on('systemMessage', function(message) {
        displaySystemMessage(message, 500);
    });
    
    var height = $(".message-container").height();

    function displayMessage (data, animationDuration) {
        if (data.msg && data.msg.length != 0) {
            $("ul#messages").append("<li><span class='timestamp hidden-xs'>[" + getDateString(data.timestamp) +
              "]</span> <span class='user-name'>" + data.userName + ":</span> " + data.msg + "</li>")
            $(".message-container").animate({scrollTop: height}, animationDuration);
            height += $(".message-container").height();
        }
    }
    
    function displaySystemMessage (message, animationDuration) {
        if (message && message.length != 0) {
            $("ul#messages").append("<li class='system-message'>" + message + "</li>")
            $(".message-container").animate({scrollTop: height}, animationDuration);
            height += $(".message-container").height();
        }
    }
    
    function getDateString (timestamp) {
        var newDate = new Date(timestamp);
        newDate.setTime(timestamp);
        var dateString = date.format(newDate, 'YYYY/MM/DD HH:mm:ss');
        return dateString;
    }

    $("form#message-form").submit(function(e){
        e.preventDefault();
        var desiredMessage = $("#m").val();
        socket.emit("message", { msg: desiredMessage, userName: userName, timestamp: new Date().getTime() })
        $("#m").val("");
        return false;
    });

});
