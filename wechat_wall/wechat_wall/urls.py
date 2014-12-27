from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'wechat_wall.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),

                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^u/', include('phone_page.urls')),
                       url(r'^', include('admin_page.urls')),
                       ) + staticfiles_urlpatterns() + static(settings.MEDIA_URL,
                                                              document_root=settings.MEDIA_ROOT)
