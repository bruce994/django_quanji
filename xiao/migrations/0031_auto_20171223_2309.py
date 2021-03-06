# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-23 23:09
from __future__ import unicode_literals

from django.db import migrations, models
import xiao.help


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0030_auto_20171221_1126'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='pay',
            options={'verbose_name': '支付记录', 'verbose_name_plural': 'A.支付记录'},
        ),
        migrations.RenameField(
            model_name='pay',
            old_name='out_trade_no',
            new_name='transaction_id',
        ),
        migrations.AlterField(
            model_name='article',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/23')),
        ),
        migrations.AlterField(
            model_name='ordering',
            name='id',
            field=models.CharField(max_length=16, primary_key=True, serialize=False, verbose_name='订单号'),
        ),
        migrations.AlterField(
            model_name='place',
            name='picurl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2017/12/23'), verbose_name='场馆座位图'),
        ),
        migrations.AlterField(
            model_name='player',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/23'), verbose_name='照片'),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='avatarUrl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2017/12/23'), verbose_name='头像'),
        ),
        migrations.AlterField(
            model_name='writings',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/23'), verbose_name=''),
        ),
    ]
