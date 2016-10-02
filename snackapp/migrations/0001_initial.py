# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-02 19:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=200)),
                ('price', models.IntegerField()),
                ('quantity', models.IntegerField()),
                ('img_url', models.CharField(max_length=200)),
            ],
        ),
    ]
