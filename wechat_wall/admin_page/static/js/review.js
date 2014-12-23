

function getTd(para) {
    return $('<td class="td-' + para + '"></td>');
}

/*
 * handle those waiting to be reviewed
 */
var reviewingMsgTdMap = {
	'content': 'content',
	'name': 'name',
	'avatar': 'avatar'
}, buttonString = '<button class="btn btn-primary">通过</button><button class="btn btn-danger">拒绝</button>'

function clearMsg() {
    $('#tbody-messages').html('');
}

function appendReviewingMsg(msg) {
    var tr = $('<tr id="' + msg[id] + '"></tr>'), key;
    for (key in reviewingMsgTdMap) {
        getTd(key).html(msg[key]).appendTo(tr);
    }
    getTd('operator').html(buttonString);
    $('#tbody-messages').append(tr);
}

function initReviewingMsg() {
    var i, len;
    for (i = 0, len = toReviewMessages.length; i < len; ++i) {
        appendMsg(toReviewMessages[i]);
    }
}

/*
 * handle those have been already reviewed
 */
var reviewedMsgTdMap = {
	'content': 'content',
	'name': 'name'
}

function appendReviewedMsg(msg) {
	var tr = $('<tr id="' + msg[id] + '"></tr>'), key;
    for (key in tdMap) {
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


/**
 * post event
 */

function response_single(data) {

}

var options_single = {
    dataType: 'json',
    success: response_single,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                },
}

$('#tbody-messages .btn-primary').click(function(e) {
	var msgID = $(this).parent().attr('id');
	setReviewType('pass');
	setMsgID(msgID);
	$(this).parent().fadeIn();
	$('#postForm').ajaxSubmit(options_single);
	return false;
});

$('#tbody-messages .btn-danger').click(function(e) {
	var msgID = $(this).parent().attr('id');
	setReviewType('reject');
	setMsgID(msgID);
	$(this).parent().fadeIn();
	$('#postForm').ajaxSubmit(options_single);
	return false;
});

function response_all(data) {
	clearMsg();
}

var options_all = {
    dataType: 'json',
    success: response_all,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                },
}

$('#allPass').click(function(e) {
	var msgID = getAllMsgID;
	setReviewType('pass');
	setMsgID(msgID);
	$('#postForm').ajaxSubmit(options_all);
	return false;
});

$('#allReject').click(function(e) {
	var msgID = getAllMsgID;
	setReviewType('reject');
	setMsgID(msgID);
	$('#postForm').ajaxSubmit(options_all);
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