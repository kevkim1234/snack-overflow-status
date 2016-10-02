from __future__ import unicode_literals

from django.db import models
from django.utils import timezone

# Create your models here.

class Item(models.Model):
    description = models.CharField(max_length=200)
    price = models.IntegerField()
    quantity = models.IntegerField()
    img_url = models.CharField(max_length=200)
    def __str__(self):
        return self.description
