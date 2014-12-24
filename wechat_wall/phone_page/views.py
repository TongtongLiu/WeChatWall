#-*- coding:utf-8 -*-

import datetime
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import redirect, render_to_response
import json

from admin_page import get_whether_review
from phone_page.safe_reverse import *
from wechat_wall.models import User, Message
from weixinlib import http_get
from weixinlib.weixin_urls import WEIXIN_URLS

MESSAGES_NUM = 20


def select_users_by_openid(openid):
    return User.objects.filter(openid=openid)


def select_users_by_name(name):
    return User.objects.filter(name=name)


def insert_message(user, content, time, status):
    new_message = Message.objects.create(user=user, content=content,
                                         time=time, status=status)
    new_message.save()


def select_messages_by_id(message_id):
    return Message.objects.filter(message_id=message_id)


def select_new_messages(max_len):
    messages = Message.objects.filter(status=1)
    messages.sort(reversed=True, cmp=lambda x, y: cmp(x.time, y.time))
    return messages[0:max_len]


def select_new_messages_after_id(message_id, max_len):
    messages = select_messages_by_id(message_id)
    if not messages:
        return select_new_messages(max_len)
    message = messages[0]
    return_messages = Message.objects.filter(Q(time__gt=message.time) | Q(time=message.time, message_id=message_id), status=1)
    return_messages.sort(reversed=True, cmp=lambda x, y: cmp(x.time, y.time))
    return return_messages[0:max_len]


def select_old_messages_before_id(message_id, max_len):
    messages = select_messages_by_id(message_id)
    if not messages:
        return select_new_messages(max_len)
    message = messages[0]
    return_messages = Message.objects.filter(Q(time__gt=message.time) | Q(time=message.time, message_id=message_id), status=1)
    return_messages.sort(reversed=True, cmp=lambda x, y: cmp(x.time, y.time))
    return return_messages[0:max_len]


def loading(request):
    code = request.GET.get('code')
    url = WEIXIN_URLS['get_openid'](code)
    res = http_get(url)
    rtn_json = json.loads(res)
    openid = rtn_json['openid']
    if select_users_by_openid(openid).exists():
        return redirect(s_reverse_wall(openid))
    else:
        return redirect(s_reverse_login(openid))


def login(request, openid):
    if (not request.POST or
            not 'name' in request.POST or
            not 'photo' in request.POST):
        raise Http404


def login_check(request):
    if not request.POST or not 'name' in request.POST:
        raise Http404
    if not select_users_by_name(request.POST['name']):
        return HttpResponse('Valid')
    else:
        return HttpResponse('Invalid')


def wall(request, openid):
    return render_to_response('wall.html')


def w_post_message(request, openid):
    if not request.POST or not 'content' in request.POST:
        raise Http404
    users = select_users_by_openid(openid)
    if not users:
        return HttpResponse('NoUser')
    user = users[0]
    content = request.POST['content']
    time = datetime.datetime.now()
    status = get_whether_review()
    try:
        insert_message(user, content, time, status)
        return HttpResponse('Success')
    except Exception as e:
        print 'Error occured!!!!!!' + str(e)
        return HttpResponse('Error')


def w_get_new_messages(request):
    if not request.POST:
        raise Http404
    if request.POST.get('message_id', ''):
        messages = select_new_messages_after_id(request.POST['message_id'], MESSAGES_NUM)
    else:
        messages = select_new_messages(MESSAGES_NUM)
    return messages


def w_get_old_messages(request):
    if not request.POST or not 'message_id' in request.POST:
        raise Http404
    messages = select_old_messages_before_id(request.POST['message_id'], MESSAGES_NUM)
    return messages
