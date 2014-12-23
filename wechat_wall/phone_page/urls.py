from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                       url(r'^loading*$', 'phone_page.views.loading'),
                       url(r'^login/(?P<openid>\S+)$', 'phone_page.views.login'),
                       url(r'^wall/(?P<openid>\S+)$', 'phone_page.views.wall'),
                       )