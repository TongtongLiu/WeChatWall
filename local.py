#-*- coding:utf-8 -*-

# this file is prepared for run server locally

from wsgiref.simple_server import make_server
from app import app
from settings import LOCAL_PORT


# here will do nothing of exception catch
# be careful:)
try:
    httpd = make_server('', LOCAL_PORT, app)
    print 'Start server at localhost:' + str(LOCAL_PORT)
except:
    print 'Cannot start server at localhost:' + str(LOCAL_PORT) + ', please check...'
    exit()

try:
    httpd.serve_forever()
except:
    print 'Finished!'
