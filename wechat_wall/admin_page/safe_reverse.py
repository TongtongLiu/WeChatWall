from django.core.urlresolvers import reverse


def s_reverse_admin_home():
    return reverse('admin_page.views.home')


def s_reverse_admin_review():
    return reverse('admin_page.views.review')
