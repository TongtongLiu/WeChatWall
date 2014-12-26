# -*- coding:utf-8 -*-

from datetime import datetime, timedelta
from django.contrib import auth
from django.core.exceptions import ObjectDoesNotExist
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext
import json
import time

from admin_page import get_whether_review, set_whether_review
from admin_page.safe_reverse import *
from wechat_wall.models import User, Message

# Create your views here.


@csrf_protect
def home(request):
    if not request.user.is_authenticated():
        return render_to_response('admin_login.html', context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect(s_reverse_admin_review())


def login(request):
    if not request.POST:
        raise Http404

    return_json = {}
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')

    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        auth.login(request, user)
        return_json['message'] = 'success'
        return_json['next'] = s_reverse_admin_review()
    else:
        time.sleep(2)
        return_json['message'] = 'failed'
        if User.objects.filter(username=username, is_active=True):
            return_json['error'] = 'wrong'
        else:
            return_json['error'] = 'none'

    return HttpResponse(json.dumps(return_json), content_type='application/json')


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(s_reverse_admin_home())


def review(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())

    to_review_messages = get_to_review_message(3000)
    new_message_reviewed = get_new_message_reviewed(6000)
    whether_review = get_whether_review()
    return render_to_response('review.html', {
        'to_review_message': to_review_messages,
        'new_message_reviewed': new_message_reviewed,
        'whether_review': whether_review,
    })


def get_to_review_message(delta_time):
    now = datetime.now()
    review_time = now - timedelta(minutes=delta_time)
    to_review_message_models = Message.objects.filter(status=0, time__gt=review_time).order_by('time')
    to_review_message_list = []
    for message in to_review_message_models:
        to_review_message_list += [wrap_message_dict(message)]
    return to_review_message_list


def get_new_message_reviewed(delta_time):
    now = datetime.now()
    new_message_time = now - timedelta(minutes=delta_time)
    new_message_reviewed_models = Message.objects.filter(status=1, time__gt=new_message_time).order_by('-time')[0:9]
    new_message_reviewed_list = []
    for message in new_message_reviewed_models:
        new_message_reviewed_list += [wrap_message_dict(message)]
    return new_message_reviewed_list


def wrap_message_dict(message):
    return_dict = model_to_dict(message)
    return_dict['name'] = message.user.name
    return_dict['avatar'] = message.user.photo
    return return_dict


@csrf_exempt
def change_review_state(request):
    if not request.is_ajax:
        raise Http404

    current_state = get_whether_review()
    set_whether_review(1 - current_state)
    return HttpResponse(json.dumps({}), content_type='application/json')


@csrf_exempt
def refresh_review_list(request):
    if not request.is_ajax:
        raise Http404

    return_json = {'messages': []}
    to_review_messages = get_to_review_message(3000)
    for message in to_review_messages:
        return_json['messages'].append({
            'id': message['message_id'],
            'name': message['name'],
            'avatar': message['avatar'],
            'content': message['content']
        })
    return HttpResponse(json.dumps(return_json), content_type='application/json')


@csrf_exempt
def review_message(request):
    if not request.POST:
        raise Http404

    handler_list = {
        'pass': pass_message,
        'reject': reject_message,
    }
    post = request.POST
    return_json = {}
    messages_id = post['id'].split(',')
    return_json['msg_id'] = ''
    for msg_id in messages_id:
        if not handler_list[post['type']](msg_id):
            return_json['result'] = 'error'
            break
        return_json['msg_id'] += (msg_id + ',')
    if not ('result' in return_json):
        return_json['type'] = post['type']
        return_json['result'] = 'success'
    return_json['msg_id'] = return_json['msg_id'][:-1] + ''
    return HttpResponse(json.dumps(return_json), content_type='application/json')


def pass_message(msg_id):
    try:
        message = Message.objects.get(message_id=msg_id)
        message.status = 1
        message.save()
        return True
    except ObjectDoesNotExist:
        return False


def reject_message(msg_id):
    try:
        message = Message.objects.get(message_id=msg_id)
        message.status = -1
        message.save()
        return True
    except ObjectDoesNotExist:
        return False


def index(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())

    return render_to_response('index.html', context_instance=RequestContext(request))


@csrf_exempt
def get_new_message(request):
    if not request.is_ajax:
        raise Http404

    if 'message_id' in request.POST:
        message = select_new_message_after_id(request.POST['message_id'])
    else:
        message = select_first_message_before_time(1000)

    return_json = {}
    if message:
        return_json['result'] = 'success'
        return_json['message'] = {
            'id': message.message_id,
            'name': message.user.name,
            'avatar': message.user.photo,
            'content': message.content,
        }
    else:
        return_json['result'] = 'no message'
    return HttpResponse(json.dumps(return_json), content_type='application/json')


def select_new_message_after_id(message_id):
    try:
        last_message = Message.objects.get(message_id=message_id)
    except ObjectDoesNotExist:
        return None
    messages = Message.objects.filter(status=1, time=last_message.time, message_id__gt=message_id).order_by('message_id')
    if messages.exists():
        return messages[0]
    messages = Message.objects.filter(time__gt=last_message.time, status=1).order_by('time')
    if messages.exists():
        return messages[0]
    return None


def select_first_message_before_time(delta_time):
    now = datetime.now()
    earliest_time = now - timedelta(minutes=delta_time)
    messages = Message.objects.filter(time__gt=earliest_time, status=1, message_id__gt=0).order_by('time', 'message_id')
    if messages.exists():
        return messages[0]
    else:
        return None
