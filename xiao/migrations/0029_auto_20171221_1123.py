# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-21 03:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0028_auto_20171221_1029'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ordering',
            name='id',
            field=models.CharField(max_length=16, primary_key=True, serialize=False),
        ),
    ]
