from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                       url(r'^wall/$', 'phone_page.views.wall'),
                       )