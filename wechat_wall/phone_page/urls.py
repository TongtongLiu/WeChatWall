from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                       url(r'^$', 'adminpage.views.home'),
                       url(r'^phone_page$', 'phone_page.views.phone_page'),
                       )