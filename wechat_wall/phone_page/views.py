#-*- coding:utf-8 -*-

import datetime
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
import json
import time

from admin_page import get_whether_review
from phone_page.banned_names import is_name_valid
from phone_page.banned_words import is_content_valid
from phone_page.safe_reverse import *
from wechat_wall.models import User, Message
from weixinlib import http_get
from weixinlib.weixin_urls import WEIXIN_URLS

MESSAGES_NUM = 20

######################## Date Operation Begin ###############################


def insert_user(openid, name, photo):
    new_user = User.objects.create(openid=openid, name=name, photo=photo)
    new_user.save()


def select_users_by_openid(openid):
    return User.objects.filter(openid=openid)


def select_users_by_name(name):
    return User.objects.filter(name=name)


def insert_message(user, content, time, status):
    new_message = Message.objects.create(user=user, content=content,
                                         time=time, status=status)
    new_message.save()
    message_num = user.message_num
    user.message_num = message_num + 1
    user.save()


def select_messages_by_id(message_id):
    return Message.objects.filter(message_id=message_id)


def select_new_messages(max_len):
    messages = Message.objects.filter(status=1).order_by('-time')
    return messages[:max_len]


def select_new_messages_after_id(message_id, max_len):
    messages = select_messages_by_id(message_id)
    if not messages:
        return select_new_messages(max_len)
    message = messages[0]
    return_messages = Message.objects.filter(Q(time__gt=message.time) |
                                             Q(time=message.time,
                                               message_id__gt=message_id),
                                             status=1).order_by('-time')
    return return_messages[:max_len]


def select_old_messages_before_id(message_id, max_len):
    messages = select_messages_by_id(message_id)
    if not messages:
        return select_new_messages(max_len)
    message = messages[0]
    return_messages = Message.objects.filter(Q(time__lt=message.time) |
                                             Q(time=message.time,
                                               message_id__lt=message_id),
                                             status=1).order_by('-time')
    return return_messages[:max_len]

######################## Date Operation End ###############################


def loading(request, openid):
    # code = request.GET.get('code')
    # url = WEIXIN_URLS['get_openid'](code)
    # res = http_get(url)
    # rtn_json = json.loads(res)
    # openid = rtn_json['openid']
    if select_users_by_openid(openid).exists():
        return redirect(s_reverse_wall(openid))
    else:
        return redirect(s_reverse_login(openid))


def login(request, openid):
    if select_users_by_openid(openid):
        return redirect(s_reverse_wall(openid))
    else:
        return render_to_response('login.html', {'openid': openid},
                                  context_instance=RequestContext(request))


def check_name(name):
    if select_users_by_name(name):
        return False
    else:
        return is_name_valid(name)


@csrf_exempt
def login_check(request):
    if not request.POST or not ('name' in request.POST):
        raise Http404
    if check_name(request.POST['name']):
        return HttpResponse('Valid')
    else:
        return HttpResponse('Invalid')


@csrf_exempt
def login_register(request):
    # if (not request.POST or
    #         not ('openid' in request.POST) or
    #         not ('name' in request.POST) or
    #         not ('photo' in request.POST or
    #              'default_photo' in request.POST)):
    if (not request.POST or
            not ('openid' in request.POST) or
            not ('name' in request.POST)):
        raise Http404
    openid = request.POST['openid']
    if select_users_by_openid(openid):
        return HttpResponse('ExistOpenid')
    name = request.POST['name']
    if not check_name(name):
        return HttpResponse('InvalidName')
    # if 'default_photo' in request.POST:
    #     default_photo = request['POST']
    #     photo = '/static1/img/' + default_photo + '.jpg'
    # else:
    #     photo = request.POST['photo']
    photo = 'http://cl.ly/image/1g322X0b0N0g/default.png'
    try:
        insert_user(openid, name, photo)
        return HttpResponse(s_reverse_wall(openid))
    except Exception as e:
        print 'Error occured!!!!!!' + str(e)
        return HttpResponse('Error')


def wall(request, openid):
    #return render_to_response('wall.html', {'openid': openid, 'name': '管理员',
    #s                                         'photo': 'http://www.baidu.com/img/bd_logo1.png'})
    # users = select_users_by_openid(openid)
    # if not users:
    #     return redirect(s_reverse_login(openid))
    # user = users[0]
    # return render_to_response('wall.html',
    #                           {'openid': openid, 'name': user.name, 'photo': user.photo},
    #                           context_instance=RequestContext(request))
    return render_to_response('wall.html')

@csrf_exempt
def w_post_message(request):
    if (not request.POST or
            not ('openid' in request.POST) or
            not ('content' in request.POST)):
        raise Http404
    users = select_users_by_openid(request.POST['openid'])
    if not users:
        return HttpResponse('NoUser')
    user = users[0]
    content = request.POST['content']
    if not is_content_valid(content):
        return HttpResponse('BannedContent')
    time = datetime.datetime.now()
    if get_whether_review() == 1:
        status = 0
    else:
        status = 1
    try:
        insert_message(user, content, time, status)
        return HttpResponse('Success')
    except Exception as e:
        print 'Error occured!!!!!!' + str(e)
        return HttpResponse('Error')


@csrf_exempt
def w_get_new_messages(request):
    if not request.POST or not ('message_id' in request.POST):
        raise Http404
    messages = select_new_messages_after_id(request.POST['message_id'], MESSAGES_NUM)
    return_json = {'messages': []}
    for message in messages:
        return_json['messages'].append({
            'message_id': message.message_id,
            'user_name': message.user.name,
            'user_photo': message.user.photo,
            'content': message.content,
            'time': int(time.mktime(message.time.timetuple()))
        })
    return HttpResponse(json.dumps(return_json), content_type='application/json')


@csrf_exempt
def w_get_old_messages(request):
    if not request.POST or not ('message_id' in request.POST):
        raise Http404
    messages = select_old_messages_before_id(request.POST['message_id'], MESSAGES_NUM)
    return_json = {'messages': []}
    for message in messages:
        return_json['messages'].append({
            'message_id': message.message_id,
            'user_name': message.user.name,
            'user_photo': message.user.photo,
            'content': message.content,
            'time': int(time.mktime(message.time.timetuple()))
        })
    return HttpResponse(json.dumps(return_json), content_type='application/json')
