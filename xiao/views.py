from django.shortcuts import render
from django.shortcuts import  get_object_or_404,render
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.http import JsonResponse
from django.core import serializers
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
import json,time,logging
from django.utils import timezone
import datetime
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.db import connection

# Create your views here.
from .models import Player,Title,Article,Writings,Comment,Userinfo,Place,Price_Place,Ordering,Pay

from xiao import help
from xiao import wxpayClass

# Create your views here.
def index(request,PageNo):
    article1 = Article.objects.filter(attr=1).order_by('-pub_date')[:1]
    article1_json  = serializers.serialize('json',article1)


    latest_list = Writings.objects.order_by('-pub_date')
    paginator = Paginator(latest_list, 5)
    try:
        latest_list = paginator.page(PageNo)
    except PageNotAnInteger:
        latest_list = paginator.page(1)
    except EmptyPage:
        latest_list = '';
    article3_json  = serializers.serialize('json',latest_list)


    latest_list = Title.objects.order_by('-pub_date')[:4]
    latest_list_json  = serializers.serialize('json',latest_list)
    data1 = json.loads(latest_list_json)
    for f in data1:
        pk = f['pk']
        article_list = Article.objects.filter(tid_id=pk).order_by('-pub_date')[:1]
        latest_json  = serializers.serialize('json',article_list)
        f['article'] = json.loads(latest_json[1:-1])

        if len(article_list) > 0 :
            article_list  = article_list[0]
            player_a = Player.objects.get(pk=article_list.player_a)
            player_a_json  = serializers.serialize('json',[player_a,])
            player_b = Player.objects.get(pk=article_list.player_b)
            player_b_json  = serializers.serialize('json',[player_b,])
            f['player_a'] = json.loads(player_a_json[1:-1])
            f['player_b'] = json.loads(player_b_json[1:-1])
        else:
            f['player_a'] = ''
            f['player_b'] = ''


    data = '{"a":"1","article1":'+article1_json+',"article3":'+article3_json+',"article2":'+json.dumps(data1)+'}'
    return HttpResponse(data, content_type='json')


def myOrder(request,uid,order_id,PageNo):
    if  order_id :
        latest_list = Ordering.objects.filter(id=order_id).order_by('-pub_date')
    else :
        latest_list = Ordering.objects.filter(uid=uid).order_by('-pub_date')
        paginator = Paginator(latest_list, 5)
        try:
            latest_list = paginator.page(PageNo)
        except PageNotAnInteger:
            latest_list = paginator.page(1)
        except EmptyPage:
            latest_list = '';

    ordering_json  = serializers.serialize('json',latest_list)

    data1 = json.loads(ordering_json)
    for f in data1:
        try:
            pk = f['pk']
            p0 = Article.objects.get(pk=f['fields']['aid'])
            p0_json  = serializers.serialize('json',[p0,])
            p1 = Place.objects.get(pk=f['fields']['pid'])
            p1_json  = serializers.serialize('json',[p1,])
            p2 = Price_Place.objects.get(pk=f['fields']['price_id'])
            p2_json  = serializers.serialize('json',[p2,])
            f['title'] = json.loads(p0_json[1:-1])
            f['place'] = json.loads(p1_json[1:-1])
            f['price_place'] = json.loads(p2_json[1:-1])
        except ObjectDoesNotExist:
            f['place'] = ''
            f['price_place'] = ''

    data = '{"a":"1","list":'+json.dumps(data1)+'}'
    return HttpResponse(data, content_type='json')




def player_list_index(request):
    return player_list(request,1)



from xiao.models import LEVEL_CHOICES
def app_choices(request):
    level = json.dumps(LEVEL_CHOICES)
    data = '{"a":"1","level":'+level+'}'
    return HttpResponse(data, content_type='json')


def player_list(request,level,PageNo):
    if level:
        latest_list = Player.objects.filter(level=level).order_by('-pub_date')
    else :
        latest_list = Player.objects.order_by('-pub_date')
    paginator = Paginator(latest_list, 10)

    #page = request.GET.get('page')
    try:
        latest_list = paginator.page(PageNo)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        latest_list = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        latest_list = '';

    latest_list_json  = serializers.serialize('json',latest_list)
    data = json.loads(latest_list_json)
    for f in data:
        tmp  = f['fields']['level']
        f['fields']['level'] =  dict(LEVEL_CHOICES).get(tmp)
    data = '{"a":"1","list":'+json.dumps(data)+'}'
    return HttpResponse(data, content_type='json')


def player(request, id):
    detail = Player.objects.get(pk=id)
    detail  = serializers.serialize('json',[detail,])
    player_list = Article.objects.filter(Q(player_a = id) | Q(player_b = id)).order_by('-pub_date')[:8]
    player_json  = serializers.serialize('json',player_list)
    data = '{"a":"1","list":'+detail+',"player_video":'+player_json+'}'
    return HttpResponse(data, content_type='json')



def type_list(request):
    latest_list = Title.objects.order_by('-pub_date')
    latest_list_json  = serializers.serialize('json',latest_list)
    data = '{"a":"1","list":'+latest_list_json+'}'
    return HttpResponse(data, content_type='json')

def video_list(request,typeid,PageNo):
    if typeid:
        latest_list = Article.objects.filter(tid_id=typeid).order_by('-pub_date')
    else :
        latest_list = Article.objects.order_by('-pub_date')
    paginator = Paginator(latest_list, 8)
    #page = request.GET.get('page')
    try:
        latest_list = paginator.page(PageNo)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        latest_list = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        latest_list = '';


    latest_list_json  = serializers.serialize('json',latest_list)
    data = json.loads(latest_list_json)
    for f in data:
        pub_date = f['fields']['pub_date']
        pub_date = pub_date.replace("T",' ')
        #需要加8小时
        pub_date = datetime.datetime.strptime(pub_date, "%Y-%m-%d %H:%M:%S") + datetime.timedelta(hours=8)
        #f['pub_date'] = pub_date.strftime("%Y-%m-%d %H:%M:%S")
        f['pub_date1'] = help.date_compare(pub_date,datetime.datetime.now())
        f['play_count1'] = help.millions_formatter(f['fields']['play_count'])

    data = '{"a":"1","list":'+json.dumps(data)+'}'
    return HttpResponse(data, content_type='json')


def video(request, id):
    detail = Article.objects.get(pk=id)
    detail_json  = serializers.serialize('json',[detail,])
    title = Title.objects.get(pk=detail.tid_id)
    title_json  = serializers.serialize('json',[title,])
    player_a = Player.objects.get(pk=detail.player_a)
    player_a_json  = serializers.serialize('json',[player_a,])
    player_b = Player.objects.get(pk=detail.player_b)
    player_b_json  = serializers.serialize('json',[player_b,])

    article_list = Article.objects.filter(tid_id = detail.tid_id).order_by('-pub_date')[:8]
    article_json  = serializers.serialize('json',article_list)

    comment_num = Comment.objects.filter(aid = id).count()

    detail.play_count += 1
    detail.save()

    data = '{"a":"1","comment_num":'+str(comment_num)+',"list":'+detail_json+',"type":'+title_json+',"player_a":'+player_a_json+',"player_b":'+player_b_json+',"article_list":'+article_json+'}'
    return HttpResponse(data, content_type='json')


def content(request, id):
    detail = Writings.objects.get(pk=id)
    detail_json  = serializers.serialize('json',[detail,])

    comment_num = Comment.objects.filter(wid = id).count()
    data = '{"a":"1","list":'+detail_json+',"comment_num":'+str(comment_num)+'}'

    detail.view += 1
    detail.save()
    return HttpResponse(data, content_type='json')


def comment_post(request,aid,wid,uid,title):
    objects = Comment()
    objects.aid = aid
    objects.title = title
    objects.wid = wid
    objects.uid = uid
    objects.pub_date = timezone.now()
    objects.save()

    if aid :
        where = Q(aid = aid)
    if wid :
        where = Q(wid = wid)
    if aid and wid :
        where = Q(aid = aid) & Q(wid = wid)

    comment_num = Comment.objects.filter(where).count()
    return HttpResponse('{"result":"success","comment_num":'+str(comment_num)+'}', content_type='json')



@csrf_exempt
def userinfo_post(request):
    try :
        tmp = Userinfo.objects.get(openid = request.POST.get('openid','') )
        objects = tmp
    except ObjectDoesNotExist:
        objects = Userinfo()
    objects.pub_date = timezone.now()
    objects.openid = request.POST.get('openid','')
    objects.nickName = request.POST.get('nickName','')
    objects.avatarUrl = request.POST.get('avatarUrl','')
    objects.city = request.POST.get('city','')
    objects.gender = request.POST.get('gender',0)
    objects.language = request.POST.get('language','')
    objects.province = request.POST.get('province','')
    objects.country = request.POST.get('country','')
    objects.save()
    uid = objects.id
    return HttpResponse('{"result":"success","uid":'+str(uid)+'}', content_type='json')

def comment_list(request,aid,wid,PageNo):
    if aid :
        where = Q(aid = aid)
    if wid :
        where = Q(wid = wid)
    if aid and wid :
        where = Q(aid = aid) & Q(wid = wid)

    latest_list = Comment.objects.filter(where).order_by('-pub_date')

    paginator = Paginator(latest_list, 10)
    comment_num = paginator.count

    #page = request.GET.get('page')
    try:
        latest_list = paginator.page(PageNo)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        latest_list = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        latest_list = '';

    latest_list_json  = serializers.serialize('json',latest_list)
    data = json.loads(latest_list_json)
    for f in data:
        uid = f['fields']['uid']

        try :
            userinfo = Userinfo.objects.get(id = uid)
            userinfo_json  = serializers.serialize('json',[userinfo,])
            f['userinfo'] = json.loads(userinfo_json[1:-1])
        except ObjectDoesNotExist:
            f['userinfo'] = ''

        pub_date = f['fields']['pub_date']
        pub_date = pub_date.replace("T",' ').replace("Z",'')
        #需要加8小时
        pub_date = datetime.datetime.strptime(pub_date, "%Y-%m-%d %H:%M:%S") + datetime.timedelta(hours=8)
        #f['pub_date'] = pub_date.strftime("%Y-%m-%d %H:%M:%S")
        f['pub_date'] = help.date_compare(pub_date,datetime.datetime.now())

    data = '{"a":"1","comment_num":'+str(comment_num)+',"list":'+json.dumps(data)+'}'
    return HttpResponse(data, content_type='json')




def area(request, id):
    detail = Place.objects.get(pk=id)
    detail_json  = serializers.serialize('json',[detail,])
    price = Price_Place.objects.filter(pid_id=detail.id).order_by('price')
    price_json  = serializers.serialize('json',price)

    data = '{"a":"1","detail":'+detail_json+',"price":'+price_json+'}'
    return HttpResponse(data, content_type='json')


def price(request, id):
    detail = Price_Place.objects.get(pk=id)
    detail_json  = serializers.serialize('json',[detail,])

    data = '{"a":"1","detail":'+detail_json+'}'
    return HttpResponse(data, content_type='json')





@csrf_exempt
def ordering_post(request):
    try :
        tmp = Ordering.objects.get(pk = request.POST.get('id','') )
        objects = tmp
    except ObjectDoesNotExist:
        objects = Ordering()
    objects.pub_date = timezone.now()
    objects.aid = request.POST.get('aid',0)
    objects.uid = request.POST.get('uid',0)
    objects.pid = request.POST.get('pid',0)
    objects.price_id = request.POST.get('price_id',0)
    objects.username = request.POST.get('username','')
    objects.tel = request.POST.get('tel','')
    objects.area = request.POST.get('area','')
    objects.address = request.POST.get('address','')
    objects.num = request.POST.get('num',0)
    objects.save()
    id = objects.id
    return HttpResponse('{"result":"success","id":'+str(id)+'}', content_type='json')



@csrf_exempt
def wxpay_notify(request):
        logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s', datefmt='%a, %d %b %Y %H:%M:%S', filename='myapp.log', filemode='w')
        logging.info(wxpayClass.xml_to_dict(request.body)) #定义一个日志文件，便于调试

        data = wxpayClass.xml_to_dict(request.body)
        if data['result_code'] == 'SUCCESS' :

            objects = Pay.objects.filter(transaction_id=data['transaction_id'])
            if objects :
                if objects.status == 0 :
                    objects.status = 1
                    objects.pub_date = timezone.now()
                    objects.save()
            else :
                objects = Pay()
                objects.orderid_id = data['out_trade_no']
                objects.transaction_id = data['transaction_id']
                objects.pay_time = data['time_end']
                objects.openid = data['openid']
                objects.summary = data['attach']
                objects.status = 1
                objects.total_fee = int(data['total_fee']) / 100.00
                objects.pub_date = timezone.now()
                objects.save()

            #order = Ordering.objects.get(pk = '8111151297954471' )
            #order.status = 1
            #order.save()
            cursor = connection.cursor()
            cursor.execute("update xiao_ordering set status=1 where id='"+data['out_trade_no']+"'")

            result_data = {
                'return_code': 'SUCCESS',
                'return_msg': 'OK'
            }
        else :
            result_data = {
                'return_code': 'FAIL',
                'return_msg': 'error'
            }
        data = wxpayClass.dict_to_xml(result_data)
        return HttpResponse(data, content_type='text/xml')


@csrf_exempt
def wxpay(request):
    #data = {
    #    'appid': 'wx79ea0abb620d7d72',
    #    'mch_id': '1493400272',
    #    'nonce_str': wxpayClass.get_nonce_str(),
    #    'body': '测试',                              # 商品描述
    #    'out_trade_no': str(int(time.time())),       # 商户订单号
    #    'total_fee': '1',
    #    'spbill_create_ip': '123.12.12.123',
    #    'notify_url': 'https://django2.yy.lanrenmb.com/xiao/wxpay_notify/',
    #    'attach': '{"msg": "自定义数据"}',
    #    'trade_type': 'JSAPI',
    #    'openid': 'oJkgV0eHkpEsymsXpFzTtK5Ojk3w'
    #}
    #merchant_key = '5582447b37dad5e6c3590afa0d5acf4a'

    data = {
        'appid': request.POST.get('appid',''),
        'mch_id': request.POST.get('mch_id',''),
        'nonce_str': wxpayClass.get_nonce_str(),
        'body': request.POST.get('body',''),                              # 商品描述
        'out_trade_no': request.POST.get('out_trade_no',''),       # 商户订单号
        'total_fee': request.POST.get('total_fee',1),
        'spbill_create_ip': help.get_client_ip(request),
        'notify_url': request.POST.get('notify_url',''),
        'attach': request.POST.get('attach',''),
        'trade_type': request.POST.get('trade_type',''),
        'openid': request.POST.get('openid','')
    }
    merchant_key = request.POST.get('merchant_key','')

    wxpay = wxpayClass.WxPay(merchant_key, **data)
    pay_info = wxpay.get_pay_info()
    if pay_info:
        return JsonResponse(pay_info)
    return JsonResponse({'errcode': 40001, 'errmsg': '请求支付失败'})



def MP_verify(request):
    return HttpResponse('1d9xJ4rIGO1etKEX')


