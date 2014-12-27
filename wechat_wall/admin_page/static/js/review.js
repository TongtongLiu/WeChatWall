function getTd(para) {
    return $('<td class="td-' + para + '"></td>');
}

$('#refresh').click(function(){
    clearReviewingMsg();
    refresh();
});

/*
 * handle something about whether_review
 */
$("[name='checkbox']").bootstrapSwitch();
$(".bootstrap-switch").tooltip({'title': '打开/关闭审核功能，关闭后所发消息无需审核即可上墙'});

$("[name='checkbox']").on('switchChange.bootstrapSwitch', function(e, data) {
			$.ajax({
				url: changeStateUrl,
				type: 'POST',
				success: changeState,
				error: function() {
					alert('error');
				}
			})
		});

function changeState() {
	whether_review = 1 - whether_review;
	if (whether_review == 1)
		showResult('审核开启成功');
	else
		showResult('审核关闭成功');
}

/*
 * handle those waiting to be reviewed
 */
var reviewingMsgTdMap = {
	'name': 'name',
	'content': 'content'
}, buttonString = '<button class="btn btn-success">通过</button><button class="btn btn-danger">拒绝</button>'

function clearReviewingMsg() {
    $('#tbody-messages').html('');
}

function appendReviewingMsg(msg) {
    var tr = $('<tr style="display:none" id="' + msg['id'] + '"></tr>'), key;
    getTd('avatar').html('<img class="img-avatar" src="' + msg['avatar'] + '" />').appendTo(tr);
    for (key in reviewingMsgTdMap) {
        getTd(key).html(msg[key]).appendTo(tr);
    }
    getTd('operator').html(buttonString).appendTo(tr);
    tr.find('.btn-success').click(passClick);
    tr.find('.btn-danger').click(rejectClick);
    $('#tbody-messages').append(tr);
    tr.fadeIn(600);
}

function showReviewingMsg() {
    var i, len;
    for (i = 0, len = toReviewMessages.length; i < len; ++i) {
        appendReviewingMsg(toReviewMessages[i]);
    }
}

function initReviewingMsg() {
    if (toReviewMessages.length > 0) {
    	clearReviewingMsg();
    	showReviewingMsg();
    } else {
    	return;
    }

}

initReviewingMsg();

function refresh() {
	$.ajax({
		url: refreshUrl,
		type: 'POST',
		success: refreshReviewList,
		error: function() {
			alert('error');
		}
	})
}

function refreshReviewList(data) {
	for (var i = 0; i < data['messages'].length; i++){
		appendReviewingMsg(data['messages'][i]);
	}
    toReviewMessages = data['messages'];
}

/*
 * handle those have been already reviewed
 */
var reviewedMsgTdMap = {
	'name': 'name',
	'content': 'content'
}

function clearReviewedMsg() {
    $('#tbody-reviewedMessages').html('');
}

function appendReviewedMsg(msg) {
	var tr = $('<tr id="' + msg['id'] + '"></tr>'), key;
    msg['content'] = shortenString(msg['content']);
    for (key in reviewedMsgTdMap) {
        getTd(key).html(msg[key]).appendTo(tr);
    }
    $('#tbody-reviewedMessages').append(tr);
}

function showReviewedMsg() {
    var i, len;
    for (i = 0, len = newMessagesReviewed.length; i < len; ++i) {
        appendReviewedMsg(newMessagesReviewed[i]);
    }
}

function addMessageToHead(msg) {
	var reviewedMessages = $('#tbody-reviewedMessages tr');
	if(reviewedMessages.length >= 8) {
		$('#tbody-reviewedMessages tr:last-child').fadeOut(600);
		setTimeout(function(){
			$('#tbody-reviewedMessages tr:last-child').remove();
		}, 1000);
	}
	var tr = $('<tr style="display:none;" id="' + msg['id'] + '"></tr>'), key;
    msg['content'] = shortenString(msg['content']);
    for (key in reviewedMsgTdMap) {
        getTd(key).html(msg[key]).appendTo(tr);
    }
    $('#tbody-reviewedMessages').prepend(tr);
    setTimeout(function(){
    	tr.fadeIn(600);
    }, 600);
}

function initReviewedMsg() {
    if (newMessagesReviewed.length > 0) {
    	clearReviewedMsg();
    	showReviewedMsg();
    } else {
    	return;
    }

}

function shortenString(str){
    var l = str.length;
    var returnStr = ''
    var count = 0, point = false;
    for(var i = 0; i < l; i++){
    	if (count >= 20) {
    		point = true;
        	break;
        }
        if(str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255){
            count += 2;
        } else {
        	count++;
        }
        returnStr += str.charAt(i);
    }
    if (point)
    	returnStr += '...';
    return returnStr;
}

initReviewedMsg();

/**
 * send message event
 */
var timer;
function showResult(result) {
	$('#resultBox').text(result);
	$('#resultBox').slideDown(700);
	clearTimeout(timer);
	timer = setTimeout(function() {
		$('#resultBox').slideUp(700)
	}, 3700);
}

function messaged(data) {
	if (data['type'] == 'review_message') {
		if (data['result'] == 'success') {
			showResult('审核消息成功');
		} else {
			showResult('审核发生错误...');
			return;
		}

		var messages_id = data['msg_id'].split(',');
		for (var i = 0; i < messages_id.length; i++) {
			$('#'+messages_id[i]).fadeOut(600);
			for (var index = 0; index < toReviewMessages.length; index++) {
				if (toReviewMessages[index]['id'] == messages_id[i]) {
					var temp = toReviewMessages.splice(index, 1);
					newMessagesReviewed.splice(0, 0, temp[0]);
					newMessagesReviewed.pop();
					if(data['action'] == 'pass')
						addMessageToHead(temp[0]);
					break;
				}
			}
		}
		setTimeout(function(){
			$('#tbody-messages tr:hidden').remove();
		}, 600);
	} else if (data['type'] == 'user_message') {
		appendReviewingMsg(data);
        delete data.type
        delete data.result
        toReviewMessages.push(data);
	}
}

function bindClickEvent(){
	$('#tbody-messages .btn-success').click(passClick);
	$('#tbody-messages .btn-danger').click(rejectClick);
}

function passClick(e) {
	var msgID = $(this).parent().parent().attr('id');
	data = {};
	data['type'] = 'review_message';
	data['action'] = 'pass';
	data['message_id'] = msgID;
	socket.send(data);
	return false;
}

function rejectClick(e) {
	var msgID = $(this).parent().parent().attr('id');
	data = {};
	data['type'] = 'review_message';
	data['action'] = 'reject';
	data['message_id'] = msgID;
	socket.send(data);
	return false;
}

$('#allPass').click(function(e) {
	var msgID = getAllMsgID();
	data = {};
	data['type'] = 'review_message';
	data['action'] = 'pass';
	data['message_id'] = msgID;
	socket.send(data);
	return false;
});

$('#allReject').click(function(e) {
	var msgID = getAllMsgID();
	data = {};
	data['type'] = 'review_message';
	data['action'] = 'reject';
	data['message_id'] = msgID;
	socket.send(data);
	return false;
});

//bindClickEvent();

function getAllMsgID() {
	var msgID = '';
	var trs = $('#tbody-messages tr');
	for(var i = 0; i < trs.length; i++) {
		if (i == trs.length - 1)
			msgID += $(trs[i]).attr('id');
		else
			msgID += $(trs[i]).attr('id') + ',';
	}
	return msgID;
}

function setReviewType(type) {
	$('#review-type').val(type);
}

function setMsgID(IDs) {
	$('#review-msgID').val(IDs);
}

/*
 * system message
 */
$('#modifySystemMessage').click(function(e){
	var disabled = $('.form-control').attr('disabled');
	if (disabled == 'disabled') {
		$('.form-control').attr('disabled', false);
		$('#modifySystemMessage').text('发送');
	} else {
		$('.form-control').attr('disabled', true);
		$('#modifySystemMessage').text('修改');
		data = {};
		data['type'] = 'admin_message';
		data['content'] = $('.form-control').val();
		socket.send(data);
	}
});

/*
 * websocket
 */
var connected = function() {
	socket.subscribe('admin');
}

var socket;
var start = function() {
        socket = new io.Socket(websocket_host, websocket_options);
        socket.connect();
        socket.on('connect', connected);
        socket.on('message', messaged);
    };

start();