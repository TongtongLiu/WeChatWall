from django.shortcuts import render
from django.shortcuts import render_to_response

# Create your views here.


def phone_page(requrst):
    return render_to_response('phone_page.html')
