# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-13 02:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0014_auto_20171213_1050'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='gender',
            field=models.IntegerField(default=0, verbose_name='姓别'),
        ),
    ]