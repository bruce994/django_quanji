# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-13 03:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0016_auto_20171213_1057'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='gender',
            field=models.IntegerField(choices=[('0', '未知'), ('1', '男'), ('2', '女')], verbose_name='姓别'),
        ),
    ]
