#-*- coding:utf-8 -*-

from datetime import datetime, timedelta
from django.contrib import auth
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext
import json
import time

from admin_page.safe_reverse import *
from wechat_wall.models import User, Message

# Create your views here.


@csrf_protect
def home(request):
    if not request.user.is_authenticated():
        return render_to_response('login.html', context_instance=RequestContext(request))
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

    to_review_message = get_to_review_message(30)
    new_message_reviewed = get_new_message_reviewed(60)
    return render_to_response('review.html', {
        'to_review_message': to_review_message,
        'new_message_reviewed': new_message_reviewed,
    })


def get_to_review_message(deltatime):
    now = datetime.now()
    review_time = now - timedelta(minutes=deltatime)
    to_review_message_models = Message.objects.filter(status=0, time__gt=review_time).order_by('time')
    to_review_message_list = []
    for message in to_review_message_models:
        to_review_message_list += [wrap_message_dict(message)]
    return to_review_message_list


def get_new_message_reviewed(deltatime):
    now = datetime.now()
    new_message_time = now - timedelta(minutes=deltatime)
    new_message_reviewed_models = Message.objects.filter(status=1, time__gt=new_message_time).order_by('time')[0:19]
    new_message_reviewed_list = []
    for message in new_message_reviewed_models:
        new_message_reviewed_list += [wrap_message_dict(message)]
    return new_message_reviewed_list


def wrap_message_dict(message):
    return_dict = model_to_dict(message)
    return return_dict


@csrf_exempt
def review_message(request):
    if not request.POST:
        raise Http404

    post = request.POST
    if post['type'] == "pass":
        messges_id = post['id'].split(',')
        for msg_id in messges_id:
            pass_message(msg_id)
    elif post['type'] == 'reject':
        messges_id = post['id'].split(',')
        for msg_id in messges_id:
            reject_message(msg_id)


def pass_message(id):
    Message.objects.filter(message_id=id).update(status=1)


def reject_message(id):
    Message.objects.filter(message_id=id).update(status=-1)

def index(request):
    return render_to_response('index.html', context_instance=RequestContext(request))