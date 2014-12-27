$(function() {

	var messaged = function(data) {
		console.log(data);
		if (data.result == 'Success') {
			if (data.type == 'user_message') {
	        	refresh(data);
	        } else if (data.type == 'admin_message') {
	        	addAdminMessage(data.content)
	        }
		}
    };

	var start = function() {
        socket = new io.Socket(websocket_host, websocket_options);
        socket.connect();
        socket.on('connect', connected);
        socket.on('message', messaged);
    };

    start();

});