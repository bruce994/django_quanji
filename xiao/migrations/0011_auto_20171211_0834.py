# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-11 08:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import tinymce.models
import xiao.help


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0010_auto_20171211_0735'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=200, verbose_name='评论内容')),
                ('pub_date', models.DateTimeField(verbose_name='发布时间')),
                ('aid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='xiao.Article', verbose_name='评论视频')),
            ],
            options={
                'verbose_name_plural': '评论',
                'verbose_name': '评论',
            },
        ),
        migrations.AlterField(
            model_name='writings',
            name='content',
            field=tinymce.models.HTMLField(),
        ),
        migrations.AlterField(
            model_name='writings',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/11'), verbose_name=''),
        ),
        migrations.AddField(
            model_name='comment',
            name='wid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='xiao.Writings', verbose_name='评论文章'),
        ),
    ]
