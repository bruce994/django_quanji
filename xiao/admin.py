from django.contrib import admin

# Register your models here.
from .models import Article,Player,Title,Writings,Comment,Userinfo,Place,Price_Place,Ordering,Pay

from django.forms import TextInput, Textarea
from django.db import models

from django.core.urlresolvers import reverse
from tinymce.widgets import TinyMCE

class ArticleInline(admin.StackedInline):
    model = Article
    extra = 1

class Price_PlaceInline(admin.StackedInline):
    model = Price_Place
    extra = 2


class PlaceAdmin(admin.ModelAdmin):
    list_display = ('title','p_picurl','address', 'pub_date')
    list_filter = ['pub_date']
    search_fields = ['title']
    fieldsets = [
        (None,               {'fields': ['title']}),
        (None,               {'fields': ['picurl']}),
        (None,               {'fields': ['address']}),
    ]
    inlines = [Price_PlaceInline]

class Price_PlaceAdmin(admin.ModelAdmin):
    list_display = ('pid','old_price','price','color', 'pub_date')
    list_filter = ['pub_date']
    search_fields = ['price']
    fieldsets = [
        (None,               {'fields': ['pid']}),
        (None,               {'fields': ['old_price']}),
        (None,               {'fields': ['price']}),
        (None,               {'fields': ['color']}),
    ]





class TitleAdmin(admin.ModelAdmin):
    list_display = ('title', 'pub_date')
    list_filter = ['pub_date']
    search_fields = ['title']
    fieldsets = [
        (None,               {'fields': ['title']}),
    ]
    inlines = [ArticleInline]



class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title','play_count_name','score','attr','tid','game_date','place', 'pub_date','was_published_recently')
    list_filter = ['pub_date']
    search_fields = ['title']
    fieldsets = [
        ('赛事标题',               {'fields': ['tid']}),
        ('比分',               {'fields': ['score']}),
        ('标题',               {'fields': ['title']}),
        ('自定义属性',               {'fields': ['attr']}),
        ('播放量',               {'fields': ['play_count']}),
        ('封面图',               {'fields': ['picurl']}),
        ('视频链接地址',               {'fields': ['video']}),
        ('比赛时间',                {'fields': ['game_date']}),
        ('对战选手A',               {'fields': ['player_a']}),
        ('对战选手B',               {'fields': ['player_b']}),
        ('场馆',               {'fields': ['pid']}),
    ]

    #改写表单
    def get_form(self, request, obj=None, **kwargs):
        form = super(ArticleAdmin, self).get_form(request, obj, **kwargs)
        tmp = [(p.id, p.username) for p in Player.objects.all()]
        form.base_fields['player_a'].choices = tmp
        form.base_fields['player_b'].choices = tmp
        return form


class ArticlePlayer(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows':4, 'cols':40})},
    }

    list_display = ('username','level','admin_picurl','height','pub_date')
    search_fields = ['username']
    fieldsets = [
        (None,               {'fields': ['username']}),
        (None,               {'fields': ['eng_name']}),
        (None,               {'fields': ['height']}),
        (None,               {'fields': ['picurl']}),
        (None,               {'fields': ['age']}),
        (None,               {'fields': ['level']}),
        (None,               {'fields': ['nationality']}),
        (None,               {'fields': ['rule']}),
        (None,               {'fields': ['alias']}),
        (None,               {'fields': ['place']}),
        (None,               {'fields': ['history']}),
        (None,               {'fields': ['glory']}),
        (None,               {'fields': ['summary']}),
    ]


    def get_form(self, request, obj=None, **kwargs):
        form = super(ArticlePlayer, self).get_form(request, obj, **kwargs)
        return form



class WritingsAdmin(admin.ModelAdmin):
    list_display = ('title','view','pub_date')
    search_fields = ['title']
    fieldsets = [
        (None,               {'fields': ['title']}),
        (None,               {'fields': ['view']}),
        (None,               {'fields': ['content']}),
        ('图片',               {'fields': ['picurl']}),
        (None, {'fields': ['pub_date']}),
    ]




class CommentAdmin(admin.ModelAdmin):
    list_display = ('title','aid_name','wid_name','uid_name','pub_date')
    search_fields = ['title']
    fieldsets = [
        (None,               {'fields': ['uid']}),
        (None,               {'fields': ['aid']}),
        (None,               {'fields': ['wid']}),
        (None,               {'fields': ['title']}),
    ]


class UserinfoAdmin(admin.ModelAdmin):
    list_display = ('nickName','avatar_picurl','gender','city','province','country','language','pub_date')
    search_fields = ['title']
    fieldsets = [
        (None,               {'fields': ['nickName']}),
        (None,               {'fields': ['avatarUrl']}),
        (None,               {'fields': ['gender']}),
        (None,               {'fields': ['city']}),
        (None,               {'fields': ['province']}),
        (None,               {'fields': ['country']}),
        (None,               {'fields': ['language']}),
    ]




class OrderingAdmin(admin.ModelAdmin):
    list_display = ('id','username','tel','area','address','aid_name','uid_name','pid_name','price_name','num','pub_date','status_name','total_price')
    list_filter = ['pub_date']
    search_fields = ['id','username','tel']
    fieldsets = [
        (None,               {'fields': ['aid']}),
        (None,               {'fields': ['uid']}),
        (None,               {'fields': ['pid']}),
        (None,               {'fields': ['price_id']}),
        (None,               {'fields': ['username']}),
        (None,               {'fields': ['tel']}),
        (None,               {'fields': ['area']}),
        (None,               {'fields': ['address']}),
        (None,               {'fields': ['num']}),
        (None,               {'fields': ['status']}),
    ]


class PayAdmin(admin.ModelAdmin):
    list_display = ('orderid','payment','transaction_id','pay_time','openid','status','total_fee','summary','pub_date')
    search_fields = ['orderid__id']  #由于orderid_id是外键


admin.site.register(Pay, PayAdmin)
admin.site.register(Ordering, OrderingAdmin)
admin.site.register(Price_Place, Price_PlaceAdmin)
admin.site.register(Place, PlaceAdmin)
admin.site.register(Article, ArticleAdmin)
admin.site.register(Player,ArticlePlayer)
admin.site.register(Writings,WritingsAdmin)
admin.site.register(Comment,CommentAdmin)
admin.site.register(Userinfo,UserinfoAdmin)
admin.site.register(Title, TitleAdmin)

admin.site.site_header = "拳击后台管理"

