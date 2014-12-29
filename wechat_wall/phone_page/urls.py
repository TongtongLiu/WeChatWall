from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                       url(r'^loading/(?P<openid>\S+)$', 'phone_page.views.loading'),
                       url(r'^login/check/$', 'phone_page.views.login_check'),
                       url(r'^login/register/$', 'phone_page.views.login_register'),
                       url(r'^login/(?P<openid>\S+)$', 'phone_page.views.login'),
                       url(r'^wall/post_messages/$', 'phone_page.views.w_post_message'),
                       url(r'^wall/new_messages/$', 'phone_page.views.w_get_new_messages'),
                       url(r'^wall/old_messages/$', 'phone_page.views.w_get_old_messages'),
                       url(r'^wall/(?P<openid>\S+)$', 'phone_page.views.wall'),
                       )