#-*- coding:utf-8 -*-

import os
import sys

path = os.path.dirname(os.path.abspath(__file__)).replace('\\','/') + '/qrhandler'
if path not in sys.path:
    sys.path.insert(1, path)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qrhandler.settings")

from django.core.handlers.wsgi import WSGIHandler
django_WSGI = WSGIHandler()


def app(environ, start_response):
    return django_WSGI.__call__(environ, start_response)

