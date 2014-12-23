__author__ = 'liutongtong'

from django.core.urlresolvers import reverse


def s_reverse_validate(openid):
    return reverse('phone_page.views.uc_account', kwargs={'openid': openid})