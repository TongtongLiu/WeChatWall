#-*- coding:utf-8 -*-
__author__ = 'liutongtong'

BANNED_WORDS= [
    u'傻逼', u'我要改名'
]


def is_content_valid(content):
    for banned_word in BANNED_WORDS:
        if banned_word in content:
            return False
    return True