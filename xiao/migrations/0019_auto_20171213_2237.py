# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-13 14:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0018_auto_20171213_1203'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='player_a',
            field=models.IntegerField(choices=[(33, '阿图·伯特别乌'), (34, '奥兰多·萨利多'), (35, '吉列尔莫·里贡多')], default=0),
        ),
        migrations.AlterField(
            model_name='article',
            name='player_b',
            field=models.IntegerField(choices=[(33, '阿图·伯特别乌'), (34, '奥兰多·萨利多'), (35, '吉列尔莫·里贡多')], default=0),
        ),
    ]
