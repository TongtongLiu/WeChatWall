__author__ = 'liutongtong'

from django.core.urlresolvers import reverse


def s_reverse_login(openid):
    return reverse('phone_page.views.login', kwargs={'openid': openid})


def s_reverse_wall(openid):
    return reverse('phone_page.views.wall', kwargs={'openid': openid})