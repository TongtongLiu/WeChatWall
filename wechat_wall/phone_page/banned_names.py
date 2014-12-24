#-*- coding:utf-8 -*-
__author__ = 'liutongtong'

BANNED_NAMES = [
    '管理员', 'root'
]


def is_name_valid(name):
    for banned_name in BANNED_NAMES:
        if banned_name in name:
            return False
    return True