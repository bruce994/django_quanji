# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-20 15:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0025_auto_20171220_2254'),
    ]

    operations = [
        migrations.AddField(
            model_name='ordering',
            name='status',
            field=models.IntegerField(choices=[(0, '未支付'), (1, '已支付')], default=0, max_length=2, verbose_name='状态'),
        ),
    ]
