# -*- coding: UTF-8 -*-

from django.db import models


class User(models.Model):
    openid = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    photo = models.CharField(max_length=255)


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User)
    content = models.CharField(max_length=1023)
    time = models.DateTimeField()
    status = models.IntegerField()
    # status:
    #  0: wait to be reviewed
    #  1: pass the review
    # -1: does not pass the review