#-*- coding:utf-8 -*-
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.template import RequestContext

# Create your views here.

@csrf_protect
def home(request):
    if not request.user.is_authenticated():
        return render_to_response('login.html', context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect(s_reverse_activity_list())

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
        return_json['next'] = s_reverse_activity_list()
    else:
        time.sleep(2)
        return_json['message'] = 'failed'
        if User.objects.filter(username=username, is_active=True):
            return_json['error'] = 'wrong'
        else:
            return_json['error'] = 'none'

    return HttpResponse(json.dumps(return_json), content_type='application/json')