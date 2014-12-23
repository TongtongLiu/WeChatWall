from django.shortcuts import render
from django.shortcuts import render_to_response

# Create your views here.


def wall(request):
    return render_to_response('wall.html')


def post_message(request):
    if ((not request.POST) or
            (not 'content' in request.POST) or
            (not 'username' in request.POST) or
            (not 'password' in request.POST)):
        raise Http404