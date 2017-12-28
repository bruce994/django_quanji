
var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()
var id = 0;
var uid = 0;
var openid = '';


Page({
  data: {
    list:{},
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
    id = options.id;
    uid = options.uid;
    var that = this;
    that.fetchData();


        wx.checkSession({
          success: function(e){
              //var uid = wx.getStorageSync('uid')
              //console.log(uid);
              wx.getUserInfo({
                  success:function(res){
                      var userInfo = res.userInfo;
                      var avatarUrl = userInfo.avatarUrl;
                      var option = {
                          header: { "Content-Type": "application/x-www-form-urlencoded" },   //post提交需要加这一行
                          url: config.api.userinfo,
                          method:'POST',
                          data: {
                            avatarUrl:avatarUrl,
                          }
                      };
                      utils.request(option,
                          function (res) {
                            if(res.data.result == 'success'){
                                var detail = res.data.detail;
                                uid = detail[0].pk;
                                openid = detail[0].fields.openid;
                            }
                      });
                   }
              });
          },
          fail: function(){
        //登陆
        wx.login({
            success:function(resLogin){

                var code = resLogin.code; //返回code
                wx.request({
                       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.appId + '&secret=' + config.secret + '&js_code=' + code + '&grant_type=authorization_code',
                       data: {},
                       header: {
                         'content-type': 'json'
                       },
                       success: function (res) {
                        openid = res.data.openid; //返回openid
                         wx.getUserInfo({
                             success:function(res){
                                 var userInfo = res.userInfo;
                                 var option = {
                                     header: { "Content-Type": "application/x-www-form-urlencoded" },   //post提交需要加这一行
                                     url: config.api.userinfo_post,
                                     method:'POST',
                                     data: {
                                       openid:openid,
                                       nickName:userInfo.nickName,
                                       avatarUrl:userInfo.avatarUrl,
                                       gender:userInfo.gender,
                                       city:userInfo.city,
                                       province:userInfo.province,
                                       country:userInfo.country,
                                       language:userInfo.language,
                                     }
                                 };

                                 utils.request(option,
                                     function (res) {
                                       if(res.data.result == 'success'){
                                          //wx.setStorage({key:"openid",data:openid});
                                          uid = res.data.uid;
                                       }
                                 });

                             }
                         });

                       }
                  });
            }
        });
        //END
      }
    });




  },

  onShow: function() {
    var that = this;
    //currentPage = 1;
    that.fetchData();
  },

  fetchData: function () {  //获取列表信息
      var that = this;
      utils.showLoading();

      var option = {
          url: config.api.myOrder + uid+"/"+id,
          data: {}
      };
        //发送数据请求
        utils.request(option,
            function (res) {
                var list = res.data.list;
                var detail = list[0];
                var price = detail['price_place']['fields']['price'] * detail['fields']['num'];
                detail['totalPrice'] = price;
                detail['title']['fields']['game_date'] = detail['title']['fields']['game_date'].replace("T"," ");
                detail['fields']['pub_date'] = detail['fields']['pub_date'].replace("T"," ");
                if(detail['fields']['status'] == 0){
                  detail['status_text'] = '未支付';
                  detail['style1'] = '';
                }else if (detail['fields']['status'] == 1) {
                  detail['status_text'] = '已支付';
                  detail['style1'] = 'color:#d02828;';
                }
                that.setData({
                  detail:detail,
                });
            });

            utils.hideLoading();
    },


  look:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../videoDetail/videoDetail?id='+data.id
    })
  },


  pay:function(){

    var that = this;

    //订单号
    var ordering_id = that.data.detail.pk;
    var totalPrice = that.data.detail.totalPrice;
    totalPrice = totalPrice * 100;

    wx.request({
      header: { "Content-Type": "application/x-www-form-urlencoded" },   //post提交需要加这一行
      url: config.api.wxpay,
      method:'POST',
      data: {
        appid:config.appId,
        mch_id:config.mch_id,
        body:'门票',
        out_trade_no:ordering_id,  //商品订单号
        total_fee:totalPrice,
        //total_fee:1,
        notify_url:config.api.wxpay_notify,
        attach: that.data.detail.title.fields.title+'-门票',
        trade_type:'JSAPI',
        openid:openid,
        merchant_key:config.merchant_key
      },






       success: function (res) {
         wx.requestPayment({
           timeStamp: res.data.timeStamp,
           nonceStr: res.data.nonceStr,
           package: res.data.package,
           signType: res.data.signType,
           paySign: res.data.paySign,
           'success': function (res) {
             wx.showToast({
               title: '支付成功',
               icon: 'success',
               duration: 2000,
               success: function(res) {
                 wx.navigateTo({
                   url: '../myOrder/myOrder?uid='+uid,
                 });
               },
             });
           },
           'fail': function (res) {
             wx.showToast({
               title: '支付失败',
               image: '../../images/error.png',
               duration: 2000,
               success: function(res) {
                 wx.navigateTo({
                   url: '../myOrder/myOrder?uid='+uid,
                 });
               },
             });
           }
         })
       }
     });



  },



})
