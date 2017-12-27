# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-21 02:29
from __future__ import unicode_literals

from django.db import migrations, models
import xiao.help


class Migration(migrations.Migration):

    dependencies = [
        ('xiao', '0027_auto_20171220_2308'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pay',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment', models.CharField(choices=[('weixin', '微信支付'), ('alipay', '支付宝')], default='weixin', max_length=20, verbose_name='付款方式')),
                ('orderid', models.CharField(default='', max_length=60, verbose_name='支付单号')),
                ('out_trade_no', models.CharField(default='', max_length=60, verbose_name='商户订单号')),
                ('pay_time', models.CharField(default='', max_length=60, verbose_name='交易时间')),
                ('openid', models.CharField(default='', max_length=60, verbose_name='微信ID')),
                ('status', models.IntegerField(choices=[(0, '未支付'), (1, '已支付')], default=0, verbose_name='状态')),
                ('summary', models.CharField(default='', max_length=100, verbose_name='备注')),
                ('pub_date', models.DateTimeField(auto_now=True, verbose_name='添加时间')),
            ],
            options={
                'verbose_name_plural': '10.支付记录',
                'verbose_name': '支付记录',
            },
        ),
        migrations.AlterField(
            model_name='article',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/21')),
        ),
        migrations.AlterField(
            model_name='ordering',
            name='id',
            field=models.CharField(max_length=32, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='place',
            name='picurl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2017/12/21'), verbose_name='场馆座位图'),
        ),
        migrations.AlterField(
            model_name='player',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/21'), verbose_name='照片'),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='avatarUrl',
            field=models.ImageField(max_length=500, upload_to=xiao.help.PathAndRename('images/2017/12/21'), verbose_name='头像'),
        ),
        migrations.AlterField(
            model_name='writings',
            name='picurl',
            field=models.ImageField(upload_to=xiao.help.PathAndRename('images/2017/12/21'), verbose_name=''),
        ),
    ]
