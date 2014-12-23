#-*- coding:utf-8 -*-

from django.shortcuts import render_to_response
import json

from weixinlib import http_get
from weixinlib.weixin_urls import WEIXIN_URLS


def loading(request):
    code = request.GET.get('code')
    url = WEIXIN_URLS['get_openid'](code)
    res = http_get(url)
    rtn_json = json.loads(res)
    openid = rtn_json['openid']
    if select_users_by_openid(openid).exists():
        return redirect(s_reverse_uc_ticket(openid))
    else:
        return redirect(s_reverse_uc_account(openid))


def wall(request, openid):
    return render_to_response('wall.html')


def post_message(request):
    if ((not request.POST) or
            (not 'content' in request.POST) or
            (not 'username' in request.POST) or
            (not 'password' in request.POST)):
        raise Http404