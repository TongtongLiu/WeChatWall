#-*- coding: UTF-8 -*-
from django.db import models

class User(models.Model):
    openid = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    photo = models.CharField(max_length=255)

class Message(models.Model):
    message_id = models.IntegerField()
    user = models.ForeignKey(User)
    content = models.CharField(maxlen=1023)
    time = models.DateTimeField()
    status = models.IntegerField()
