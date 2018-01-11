# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-28 15:37
from __future__ import unicode_literals

from django.db import migrations, models
import xiao.help


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0040_auto_20171227_2305'),
    ]

    operations = [
        migrations.CreateModel(
            name='Lession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='课程名称')),
                ('picurl', models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2017/12/28'), verbose_name='图片')),
                ('price', models.FloatField(default='0.00', verbose_name='课程价格')),
                ('exercise_time', models.IntegerField(choices=[('0', '7天'), ('1', '一个月'), ('2', '三个月'), ('3', '6个月'), ('4', '8个月'), ('5', '一年'), ('6', '二年')], default=0, verbose_name='课程时间')),
                ('address', models.CharField(max_length=1000, verbose_name='地址')),
                ('pub_date', models.DateTimeField(auto_now_add=True, verbose_name='发布时间')),
            ],
            options={
                'verbose_name': '课程',
                'ordering': ['-pub_date'],
                'verbose_name_plural': 'B.课程',
            },
        ),
        migrations.CreateModel(
            name='Teach',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='教练名称')),
                ('picurl', models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2017/12/28'), verbose_name='教练照片')),
                ('summary', models.TextField(blank=True, max_length=2001, verbose_name='简介')),
                ('pub_date', models.DateTimeField(auto_now_add=True, verbose_name='发布时间')),
            ],
            options={
                'verbose_name': '教练',
                'ordering': ['-pub_date'],
                'verbose_name_plural': 'C.教练',
            },
        ),
        migrations.AlterModelOptions(
            name='ordering',
            options={'ordering': ['-pub_date'], 'verbose_name': '订单', 'verbose_name_plural': '9.订单'},
        ),
        migrations.AlterField(
            model_name='article',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/28')),
        ),
        migrations.AlterField(
            model_name='place',
            name='picurl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2017/12/28'), verbose_name='场馆座位图'),
        ),
        migrations.AlterField(
            model_name='player',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/28'), verbose_name='照片'),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='avatarUrl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2017/12/28'), verbose_name='头像'),
        ),
        migrations.AlterField(
            model_name='writings',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/28'), verbose_name=''),
        ),
    ]
