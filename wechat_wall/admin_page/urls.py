from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                       url(r'^$', 'admin_page.views.home'),
                       url(r'^login/$', 'admin_page.views.login'),
                       url(r'^review/$', 'admin_page.views.review'),
                       url(r'^logout/$', 'admin_page.views.logout'),
                       url(r'^review_message/$', 'admin_page.views.review_message'),
                       )