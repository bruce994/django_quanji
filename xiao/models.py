from django.db import models
from django.utils import timezone
from django.utils.deconstruct import deconstructible
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.functional import lazy
from django.db import connection
from django.conf import settings
from django.core.urlresolvers import reverse
# Create your models here.
from xiao import help


from tinymce.models import HTMLField
from random import randint
import datetime
import os, time, uuid


def get_player():
    cursor = connection.cursor()
    cursor.execute("select id, username from xiao_player")
    return cursor.fetchall()


class Place(models.Model):
    title = models.CharField('场馆名称',max_length=500,default='')
    image_path = time.strftime('images/%Y/%m/%d')
    picurl = models.ImageField(upload_to=help.PathAndRename(image_path),verbose_name="场馆座位图",max_length=500)
    address = models.CharField('地址',max_length=500,default='')
    pub_date = models.DateTimeField('更新时间',auto_now_add=True)

    def p_picurl(self):
            url =  '<img src="%s%s" width="%d" height="%d"/>' % (settings.MEDIA_URL,self.picurl,200,150)
            return '<a href="%s%s">%s</a>' % (settings.MEDIA_URL,self.picurl,url)
    p_picurl.allow_tags = True
    p_picurl.short_description = '场馆座位图'

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "场馆"
        verbose_name_plural = "3.场馆"


class Price_Place(models.Model):
    pid  = models.ForeignKey(Place,verbose_name='场馆',on_delete=models.CASCADE)
    old_price = models.FloatField('原价',default='0.00')
    price = models.FloatField('会员价',default='0.00')
    color = models.CharField('显示颜色',max_length=20,default='')
    pub_date = models.DateTimeField('更新时间',auto_now_add=True)

    def __str__(self):
        return str(self.price)

    class Meta:
        verbose_name = "票价"
        verbose_name_plural = "4.票价"


LEVEL_CHOICES = [("1","轻量级(70KG)"),("2","轻量级(80KG)"),("3","轻量级(90KG)"),("4","重量级(100KG)"),("5","重量级(110KG)"),("6","重量级(120KG)")]
class Player(models.Model):
    username = models.CharField('姓名',max_length=200)
    eng_name = models.CharField('英文名',max_length=300,default='')
    height = models.IntegerField('身高cm', default=120, validators=[MaxValueValidator(300), MinValueValidator(100)])
    age = models.IntegerField('年龄', default=30, validators=[MaxValueValidator(100), MinValueValidator(10)])
    level = models.CharField('级别',max_length=50, choices=LEVEL_CHOICES)
    rule = models.CharField('赛制',max_length=50, choices=[("自由搏击","自由搏击")])
    nationality = models.CharField('国籍',max_length=20,blank=True)
    alias = models.CharField('绰号',max_length=50, blank=True)
    place = models.CharField('场馆',max_length=50, blank=True)
    history = models.CharField('历史战绩',max_length=2000, blank=True)
    glory = models.CharField('头衔',max_length=2000, blank=True)
    summary = models.TextField('简介',max_length=2001, blank=True)
    def __str__(self):
        return self.username
    image_path = time.strftime('images/%Y/%m/%d')
    picurl = models.ImageField(upload_to=help.PathAndRename(image_path),verbose_name="照片" )
    pub_date = models.DateTimeField('发布时间',auto_now_add=True)

    def admin_picurl(self):
        return '<img src="%s%s" width="%d" height="%d"/>' % (settings.MEDIA_URL,self.picurl,80,60)
    admin_picurl.allow_tags = True
    admin_picurl.short_description = '照片'

    class Meta:
        verbose_name = "选手"
        verbose_name_plural = "5.选手"



class Title(models.Model):
    title = models.CharField('赛事分类',max_length=200)
    pub_date = models.DateTimeField('发布时间',auto_now_add=True)
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "赛事分类"
        verbose_name_plural = "1.赛事分类"




class Article(models.Model):
    tid  = models.ForeignKey(Title,verbose_name='赛事分类',on_delete=models.CASCADE)
    title = models.CharField('标题',max_length=200)
    score = models.CharField('比分',max_length=200,default='')
    image_path = time.strftime('images/%Y/%m/%d')
    #picurl = models.ImageField(upload_to='upload/%s' % image_path )
    picurl = models.ImageField(upload_to=help.PathAndRename(image_path) )
    video = models.CharField(max_length=1000)
    game_date = models.DateTimeField('比赛时间')
    pub_date = models.DateTimeField('发布时间',auto_now_add=True)
    play_count = models.IntegerField('播放量',default=0)
    #player_a = models.ForeignKey(Player,related_name='对战选手A')
    #player_a = models.IntegerField(default=0,choices=[(0, '----------')])
    #player_b = models.IntegerField(default=0,choices=[(0, '----------')])
    tmp = [(p.id, p.username) for p in Player.objects.all()]
    player_a = models.IntegerField(default=0,choices=tmp)
    player_b = models.IntegerField(default=0,choices=tmp)

    place = [(p.id, p.title) for p in Place.objects.all()]
    place = [(0,'')] + place
    pid = models.IntegerField('场馆',default=0,choices=place)

    APPROVAL_CHOICES = (
        ('0', ''),
        ('1', '首页'),
    )
    attr = models.CharField('自定义属性',default='',choices=APPROVAL_CHOICES, max_length=2)

    def __str__(self):
        return self.title

    def play_count_name(self):
        return help.millions_formatter(self.play_count)
    play_count_name.short_description = '播放量'


    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now
    was_published_recently.admin_order_field = 'pub_date'
    was_published_recently.boolean = True
    was_published_recently.short_description = '是否最新发布'

    def place(self):
        tmp = Place.objects.get(pk=self.pid)
        return tmp.title
    place.short_description = '场馆'

    def __init__(self,  *args, **kwargs):
        super(Article, self).__init__(*args, **kwargs)
        tmp = [(p.id, p.username) for p in Player.objects.all()]
        self._meta.get_field('player_a').choices =  tmp #动态添加select
        self._meta.get_field('player_b').choices =  tmp #动态添加select


    class Meta:
        verbose_name = "赛事对决"
        verbose_name_plural = "2.赛事对决"

class Writings(models.Model):
    title = models.CharField('标题',max_length=200,default='')
    image_path = time.strftime('images/%Y/%m/%d')
    picurl = models.ImageField('',upload_to=help.PathAndRename(image_path) )
    #content = models.TextField('内容',default='')
    content = HTMLField()
    view = models.IntegerField('阅读量',default=0)
    pub_date = models.DateTimeField('发布时间')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "资讯"
        verbose_name_plural = "8.资讯"


class Comment(models.Model):
    aid  = models.IntegerField('视频ID',default=0)
    wid  = models.IntegerField('文章ID',default=0)
    uid  = models.IntegerField('会员ID',default=0)
    title = models.CharField('评论内容',max_length=200,default='')
    pub_date = models.DateTimeField('发布时间',auto_now_add=True)

    def aid_name(self):
        tmp = Article.objects.get(pk=self.aid)
        url = reverse('admin:%s_%s_change' %(tmp._meta.app_label,  tmp._meta.model_name),  args=[tmp.pk] )
        return '<a href="%s">%s</a>' % (url,tmp.title)
    aid_name.allow_tags = True
    aid_name.short_description = '评论视频'

    def wid_name(self):
        tmp = Writings.objects.get(pk=self.wid)
        url = reverse('admin:%s_%s_change' %(tmp._meta.app_label,  tmp._meta.model_name),  args=[tmp.pk] )
        return '<a href="%s">%s</a>' % (url,tmp.title)
    wid_name.allow_tags = True
    wid_name.short_description = '评论文章'

    def uid_name(self):
        return ''
    uid_name.short_description = '评论人'


    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "评论"
        verbose_name_plural = "7.评论"






class Userinfo(models.Model):
    openid = models.CharField(max_length=200,default='')
    image_path = time.strftime('images/%Y/%m/%d')
    avatarUrl = models.ImageField(upload_to=help.PathAndRename(image_path),verbose_name="头像",max_length=500)
    city = models.CharField('城市',max_length=20,default='')
    country = models.CharField('国家',max_length=20,default='')
    gender = models.CharField('姓别',max_length=1, choices=[("0","未知"),("1","男"),("2","女")],default='0')
    language = models.CharField('语言',max_length=20,default='')
    nickName = models.CharField('名称',max_length=20,default='')
    province = models.CharField('省份',max_length=20,default='')
    pub_date = models.DateTimeField('时间',auto_now_add=True)

    def avatar_picurl(self):
            return '<img src="%s" width="%d" height="%d"/>' % (self.avatarUrl,80,60)
    avatar_picurl.allow_tags = True
    avatar_picurl.short_description = '头像'

    def __str__(self):
        return self.nickName

    class Meta:
        verbose_name = "用户"
        verbose_name_plural = "6.用户"


class Ordering(models.Model):
    id = models.CharField('订单号',primary_key=True, max_length=16)
    def save(self):
        if not self.id:
            n = 16
            self.id = ''.join(["%s" % randint(0, 9) for num in range(0, n)])   #随机数
            super(Ordering, self).save()

    aid  = models.IntegerField('赛事ID',default=0)
    uid  = models.IntegerField('会员ID',default=0)
    pid  = models.IntegerField('场馆ID',default=0)
    price_id  = models.IntegerField('票价ID',default=0)
    username = models.CharField('姓名',max_length=20,default='')
    tel = models.CharField('电话',max_length=20,default='')
    area = models.CharField('区域',max_length=20,default='')
    address = models.CharField('地址',max_length=100,default='')
    num  = models.IntegerField('数量',default=0)

    APPROVAL_CHOICES = ( (0, '未支付'), (1, '已支付'),)
    status = models.IntegerField('状态',default=0,choices=APPROVAL_CHOICES)
    pub_date = models.DateTimeField('添加时间',auto_now_add=True)

    def __str__(self):
        return self.id

    def uid_name(self):
        tmp = Userinfo.objects.get(pk=self.uid)
        return  tmp.nickName
    uid_name.allow_tags = True
    uid_name.short_description = '微信用户'


    def aid_name(self):
        tmp = Article.objects.get(pk=self.aid)
        return  tmp.title
    aid_name.allow_tags = True
    aid_name.short_description = '赛事'

    def pid_name(self):
        tmp = Place.objects.get(pk=self.pid)
        return  tmp.title
    pid_name.allow_tags = True
    pid_name.short_description = '场馆'

    def price_name(self):
        tmp = Price_Place.objects.get(pk=self.price_id)
        return  tmp.price
    price_name.allow_tags = True
    price_name.short_description = '票价'

    def total_price(self):
        P = Price_Place.objects.get(pk=self.price_id)
        tmp = self.num * P.price
        return  tmp
    total_price.allow_tags = True
    total_price.short_description = '支付金额'


    def status_name(self):
        return self.status
    #status_name.admin_order_field = 'status'
    status_name.boolean = True
    status_name.short_description = '是否支付'

    class Meta:
        verbose_name = "订单"
        verbose_name_plural = "9.订单"


class Pay(models.Model):
    orderid  = models.ForeignKey(Ordering,verbose_name='支付单号')
    APPROVAL_CHOICES = ( ('weixin', '微信支付'), ('alipay', '支付宝'),)
    payment = models.CharField('付款方式',max_length=20,default='weixin',choices=APPROVAL_CHOICES)
    transaction_id = models.CharField('商户订单号',max_length=60,default='')
    pay_time = models.CharField('交易时间',max_length=60,default='')
    openid = models.CharField('微信ID',max_length=60,default='')
    APPROVAL_CHOICES = ( (0, '未支付'), (1, '已支付'),)
    status = models.IntegerField('状态',default=0,choices=APPROVAL_CHOICES)
    total_fee = models.FloatField('交易金额',default='0.00')
    summary = models.CharField('备注',max_length=100,default='')
    pub_date = models.DateTimeField('添加时间',auto_now_add=True)

    def __str__(self):
        return str(self.orderid)

    class Meta:
        verbose_name = "支付记录"
        verbose_name_plural = "A.支付记录"



