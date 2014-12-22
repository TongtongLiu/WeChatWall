from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                       url(r'^$', 'admin_page.views.home'),
                       url(r'^login/$', 'admin_page.views.login'),
                       )