function getTd(para) {
    return $('<td class="td-' + para + '"></td>');
}

/*
 * handle something about whether_review
 */

function changePrimaryBtn() {
	if whether_review == 1
		$('#reviewState').text('关闭审核');
	else
		$('#reviewState').text('开启审核');
}

changePrimaryBtn();

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
    var tr = $('<tr id="' + msg['id'] + '"></tr>'), key;
    getTd('avatar').html('<img class="img-avatar" src="' + msg['avatar'] + '" />').appendTo(tr);
    for (key in reviewingMsgTdMap) {
        getTd(key).html(msg[key]).appendTo(tr);
    }
    getTd('operator').html(buttonString).appendTo(tr);
    $('#tbody-messages').append(tr);
}

function initReviewingMsg() {
    var i, len;
    for (i = 0, len = toReviewMessages.length; i < len; ++i) {
        appendReviewingMsg(toReviewMessages[i]);
    }
}

clearReviewingMsg();
initReviewingMsg();

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
    for (key in reviewedMsgTdMap) {
        getTd(key).html(msg[key]).appendTo(tr);
    }
    $('#tbody-reviewedMessages').append(tr);
}

function initReviewedMsg() {
    var i, len;
    for (i = 0, len = newMessagesReviewed.length; i < len; ++i) {
        appendReviewedMsg(newMessagesReviewed[i]);
    }
}

function addMessageToHead(msg) {
	var reviewedMessages = $('#tbody-reviewedMessages tr');
	if(reviewedMessages.length >= 10) {
		$('#tbody-reviewedMessages tr:last-child').fadeOut(600);
		setTimeout(function(){
			$('#tbody-reviewedMessages tr:last-child').remove();
		}, 1000);
	}
	var tr = $('<tr style="display:none;" id="' + msg['id'] + '"></tr>'), key;
    for (key in reviewedMsgTdMap) {
        getTd(key).html(msg[key]).appendTo(tr);
    }
    $('#tbody-reviewedMessages').prepend(tr);
    setTimeout(function(){
    	tr.fadeIn(600);
    }, 600);
}

clearReviewedMsg();
initReviewedMsg();

/**
 * post event
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

function response(data) {
	if(data['result'] == 'success') {
		showResult('审核消息成功');
	} else {
		showResult('审核发生错误...');
	}
	var messages_id = data['msg_id'].split(',');
	for(var i = 0; i < messages_id.length; i++) {
		$('#'+messages_id[i]).fadeOut(600);
		setTimeout(function(){
			$('#'+messages_id[i]).remove();
		}, 1000)
		for(var index = 0; index < toReviewMessages.length; index++) {
			if(toReviewMessages[index]['id'] == messages_id[i]) {
				var temp = toReviewMessages.splice(index, 1);
				newMessagesReviewed.splice(0, 0, temp[0]);
				newMessagesReviewed.pop();
				addMessageToHead(temp[0]);
				break;
			}
		}
	}
}

var options = {
    dataType: 'json',
    success: response,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                },
}

$('#tbody-messages .btn-success').click(function(e) {
	var msgID = $(this).parent().parent().attr('id');
	setReviewType('pass');
	setMsgID(msgID);
	$('#postForm').ajaxSubmit(options);
	return false;
});

$('#tbody-messages .btn-danger').click(function(e) {
	var msgID = $(this).parent().parent().attr('id');
	setReviewType('reject');
	setMsgID(msgID);
	$('#postForm').ajaxSubmit(options);
	return false;
});

$('#allPass').click(function(e) {
	var msgID = getAllMsgID;
	setReviewType('pass');
	setMsgID(msgID);
	$('#postForm').ajaxSubmit(options);
	return false;
});

$('#allReject').click(function(e) {
	var msgID = getAllMsgID;
	setReviewType('reject');
	setMsgID(msgID);
	$('#postForm').ajaxSubmit(options);
	return false;
});

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