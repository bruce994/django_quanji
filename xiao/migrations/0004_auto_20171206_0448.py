# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-06 04:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0003_article_game_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='game_date',
            field=models.DateTimeField(verbose_name='比赛时间'),
        ),
    ]