#-*- coding:utf-8 -*-

import base64
import datetime
from django.db.models import Q
from django.forms.models import model_to_dict
from django.http import Http404, HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
import json
import random
import time

from admin_page.views import get_whether_review
from phone_page.banned_names import is_name_valid
from phone_page.banned_words import is_content_valid
from phone_page.safe_reverse import *
from wechat_wall.models import User, Message
from wechat_wall.settings import PHOTO_DEFAULT_URL, PHOTO_UPLOAD_URL, PHOTO_UPLOAD_ROOT

MESSAGES_NUM = 20
DEFAULT_PHOTO_NUM = 2

######################## Data Operation Begin ###############################


def insert_user(openid, name, photo):
    new_user = User.objects.create(openid=openid, name=name, photo=photo)
    new_user.save()


def select_users_by_openid(openid):
    return User.objects.filter(openid=openid)


def select_users_by_name(name):
    return User.objects.filter(name=name)


def update_user_by_openid(openid, name, photo):
    user = select_users_by_openid(openid)[0]
    user.name = name
    user.photo = photo
    user.save()


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
    return Message.objects.filter(status=1).order_by('-time')[:max_len]


def select_new_messages_after_id(message_id, max_len):
    messages = select_messages_by_id(message_id)
    if not messages:
        return select_new_messages(max_len)
    message = messages[0]
    return Message.objects.filter(Q(time__gt=message.time) |
                                  Q(time=message.time,
                                    message_id__gt=message_id),
                                  status=1).order_by('-time')[:max_len]


def select_old_messages_before_id(message_id, max_len):
    messages = select_messages_by_id(message_id)
    if not messages:
        return select_new_messages(max_len)
    message = messages[0]
    return Message.objects.filter(Q(time__lt=message.time) |
                                  Q(time=message.time,
                                    message_id__lt=message_id),
                                  status=1).order_by('-time')[:max_len]


def get_origin_messages(number):
    now = datetime.datetime.now()
    new_message_reviewed_models = Message.objects.filter(status=1, time__lt=now).order_by('-time')[0:number]
    new_message_reviewed_list = []
    for message in new_message_reviewed_models:
        new_message_reviewed_list += [wrap_message_dict(message)]
    return new_message_reviewed_list

######################## Data Operation End ###############################


def wrap_message_dict(message):
    return_dict = model_to_dict(message)
    return_dict['user_name'] = message.user.name
    return_dict['user_photo'] = message.user.photo
    return return_dict


def loading(request, openid):
    if select_users_by_openid(openid).exists():
        return redirect(s_reverse_wall(openid))
    else:
        return redirect(s_reverse_login(openid))


def login(request, openid):
    if select_users_by_openid(openid):
        return redirect(s_reverse_wall(openid))
    else:
        photo_num = random.randint(1, DEFAULT_PHOTO_NUM)
        photo_path = get_default_photo_path(photo_num)
        photo_default_path = get_default_photo_path(0)
        return render_to_response('login.html',
                                  {'openid': openid, 'photo_path': photo_path,
                                   'photo_default_path', photo_default_path},
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
    if (not request.POST or
            not ('openid' in request.POST) or
            not ('name' in request.POST) or
            not ('photo' in request.POST)):
        raise Http404
    openid = request.POST['openid']
    name = request.POST['name']
    if not check_name(name):
        return HttpResponse('InvalidName')
    photo_base64 = request.POST['photo']
    if not photo_base64.startswith('data:image/jpeg;base64,'):
        # default photo
        # photo_path = PHOTO_DEFAULT_ROOT + photo_base64[photo_base64.rfind('/')+1:]
        photo_path = photo_base64
    else:
        # base64 decode
        photo_data = base64.b64decode(photo_base64[len('data:image/jpeg;base64,'):])
        photo_path = PHOTO_UPLOAD_ROOT + openid + '.png'
        photo_file = open(photo_path, 'wb')
        photo_file.write(photo_data)
        photo_file.close()
        photo_path = PHOTO_UPLOAD_URL + photo_path[photo_path.rfind('/')+1:]
    try:
        if select_users_by_openid(openid):
            update_user_by_openid(openid, name, photo_path)
        else:
            insert_user(openid, name, photo_path)
        return HttpResponse(s_reverse_wall(openid))
    except Exception as e:
        print 'Error occured!!!!!!' + str(e)
        return HttpResponse('Error')


def get_default_photo_path(photo_num):
    return PHOTO_DEFAULT_URL + str(photo_num) + '.png'


def wall(request, openid):
    users = select_users_by_openid(openid)
    if not users:
        return redirect(s_reverse_login(openid))
    user = users[0]
    # origin_messages = get_origin_messages(MESSAGES_NUM)
    return render_to_response('wall.html',
                              {'openid': openid, 'name': user.name, 'photo': user.photo,},
                              # 'origin_messages': origin_messages},
                              context_instance=RequestContext(request))

@csrf_exempt
def w_post_message(request):
    if (not request.POST or
            not ('openid' in request.POST) or
            not ('content' in request.POST)):
        raise Http404
    user = select_users_by_openid(request.POST['openid'])[0]
    content = request.POST['content']
    if not is_content_valid(content):
        return HttpResponse('BannedContent')
    time = datetime.datetime.now()
    status = 1 - get_whether_review()
    try:
        insert_message(user, content, time, status)
        return HttpResponse('Success')
    except Exception as e:
        print 'Error occured!!!!!!' + str(e)
        return HttpResponse('Error')


@csrf_exempt
def w_get_new_messages(request):
    if not request.GET or not ('message_id' in request.GET):
        raise Http404
    messages = select_new_messages_after_id(request.GET['message_id'], MESSAGES_NUM)
    return_json = {'messages': []}
    for message in messages:
        return_json['messages'].append({
            'message_id': message.message_id,
            'user_name': message.user.name,
            'user_photo': message.user.photo,
            'content': message.content,
            # 'time': int(time.mktime(message.time.timetuple()))
        })
    return HttpResponse(json.dumps(return_json), content_type='application/json')


@csrf_exempt
def w_get_old_messages(request):
    if not request.GET or not ('message_id' in request.GET):
        raise Http404
    messages = select_old_messages_before_id(request.GET['message_id'], MESSAGES_NUM)
    return_json = {'messages': []}
    for message in messages:
        return_json['messages'].append({
            'message_id': message.message_id,
            'user_name': message.user.name,
            'user_photo': message.user.photo,
            'content': message.content,
            # 'time': int(time.mktime(message.time.timetuple()))
        })
    return HttpResponse(json.dumps(return_json), content_type='application/json')

