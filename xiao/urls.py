from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^index/(PageNo/(?P<PageNo>[0-9]+)/)?$', views.index, name='index'),
    url(r'^content/(?P<id>[0-9]+)/$', views.content, name='content'),
    url(r'^app_choices/$', views.app_choices, name='app_choices'),
    url(r'^player_list/((?P<level>[0-9]+)/)?(PageNo/(?P<PageNo>[0-9]+)/)?$', views.player_list, name='player_list'),
    url(r'^player/(?P<id>[0-9]+)/$', views.player, name='player'),
    url(r'^video/(?P<id>[0-9]+)/$', views.video, name='video'),
    url(r'^area/(?P<id>[0-9]+)/$', views.area, name='area'),
    url(r'^price/(?P<id>[0-9]+)/$', views.price, name='price'),
    url(r'^type_list/$', views.type_list, name='type_list'),
    url(r'^video_list/((?P<typeid>[0-9]+)/)?(PageNo/(?P<PageNo>[0-9]+)/)?$', views.video_list, name='video_list'),
    url(r'^comment_list/(aid/(?P<aid>[0-9]+)/)?(wid/(?P<wid>[0-9]+)/)?(PageNo/(?P<PageNo>[0-9]+)/)?$', views.comment_list, name='comment_list'),
    url(r'^comment_post/(?P<aid>[0-9]+)/(?P<wid>[0-9]+)/(?P<uid>[0-9]+)/(?P<title>\w+)?$', views.comment_post, name='comment_post'),
    url(r'^userinfo/$', views.userinfo, name='userinfo'),
    url(r'^userinfo_post/$', views.userinfo_post, name='userinfo_post'),
    url(r'^ordering_post/$', views.ordering_post, name='ordering_post'),
    url(r'^wxpay/$', views.wxpay, name='wxpay'),
    url(r'^wxpay_notify/$', views.wxpay_notify, name='wxpay_notify'),
    url(r'^myOrder/(?P<uid>[0-9]+)/((?P<order_id>[0-9]+)/)?(PageNo/(?P<PageNo>[0-9]+)/)?$', views.myOrder, name='myOrder'),
    url(r'^MP_verify_1d9xJ4rIGO1etKEX\.txt/$', views.MP_verify, name='MP_verify'),
]



