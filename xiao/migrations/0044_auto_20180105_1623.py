# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-01-05 16:23
from __future__ import unicode_literals

from django.db import migrations, models
import xiao.help


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0043_lession_teach_ids'),
    ]

    operations = [
        migrations.AddField(
            model_name='ordering',
            name='typeid',
            field=models.IntegerField(choices=[(0, '赛事'), (1, '课程')], default=0, verbose_name='类型'),
        ),
        migrations.AlterField(
            model_name='article',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2018/01/05')),
        ),
        migrations.AlterField(
            model_name='lession',
            name='picurl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2018/01/05'), verbose_name='图片'),
        ),
        migrations.AlterField(
            model_name='lession',
            name='teach_ids',
            field=models.ManyToManyField(to='xiao.Teach', verbose_name='选择教练'),
        ),
        migrations.AlterField(
            model_name='place',
            name='picurl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2018/01/05'), verbose_name='场馆座位图'),
        ),
        migrations.AlterField(
            model_name='player',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2018/01/05'), verbose_name='照片'),
        ),
        migrations.AlterField(
            model_name='teach',
            name='picurl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2018/01/05'), verbose_name='教练照片'),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='avatarUrl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2018/01/05'), verbose_name='头像'),
        ),
        migrations.AlterField(
            model_name='writings',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2018/01/05'), verbose_name=''),
        ),
    ]