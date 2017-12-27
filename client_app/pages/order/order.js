
var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()
var pid = 0;
var aid = 0;
var price_id = 0;
var ordering_id = 0;
var uid = 0;
var openid = '';

Page({
  data: {
    username:'',
    tel:'',
    area:'',
    address:'',
    num:1,
    totalPrice:'',
    detail:{},
    price:{},
    article:{},
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
    pid = options.pid;
    aid = options.aid;
    price_id = options.price_id;
    var that = this;
    that.fetchData();

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
          url: config.api.area + pid,
          data: {}
      };
        //发送数据请求
        utils.request(option,
            function (res) {
                var list = res.data.detail;
                var detail = list[0].fields;
                that.setData({
                  detail:detail,
                });
            });


            var option = {
                url: config.api.video + aid,
                data: {}
            };
              //发送数据请求
              utils.request(option,
                  function (res) {
                      var list = res.data.list;
                      var article = list[0].fields;
                      var tmp = article.game_date;
                      article.game_date = tmp.replace("T"," ");
                      that.setData({
                        article:article,
                      });

                  });



            //票价
            var option = {
                url: config.api.price + price_id,
                data: {}
            };
              //发送数据请求
              utils.request(option,
                  function (res) {
                      var detail = res.data.detail;
                      var price = detail[0].fields;
                      that.setData({
                        price:price,
                        totalPrice:price.price,
                      });
                  });
            //END 票价

            utils.hideLoading();



    },


    redNum:function(){
      var that = this;
      var num = that.data.num;
      var price = that.data.price;
      if(num == 1){
        utils.alert_msg('最少购买一张票!','error');
        return;
      }
      num = num - 1;
      var totalPrice = price.price * num;
      that.setData({
        num:num,
        totalPrice:totalPrice
      });
    },

    addNum:function(){
      var that = this;
      var num = that.data.num;
      var price = that.data.price;
      num = num + 1;
      var totalPrice = price.price * num;
      that.setData({
        num:num,
        totalPrice:totalPrice
      });
    },



  goAddress:function(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },



  inputUsername:function(e){
     this.setData({
       username:e.detail.value
     })
  },

  inputTel:function(e){
     this.setData({
       tel:e.detail.value
     })
  },


  inputArea:function(e){
     this.setData({
       area:e.detail.value
     })
  },


  inputAddress:function(e){
     this.setData({
       address:e.detail.value
     })
  },


  sign:function(){
    var that = this;

    var username = that.data.username;
    if(username == ''){
        utils.alert_msg('姓名不能为空!','error');
        return;
    }

    var tel = that.data.tel;
    if(tel == ''){
        utils.alert_msg('电话不能为空!','error');
        return;
    }


    var area = that.data.area;
    if(area == ''){
        utils.alert_msg('地区不能为空!','error');
        return;
    }

    var address = that.data.address;
    if(address == ''){
        utils.alert_msg('地址不能为空!','error');
        return;
    }

    var num = that.data.num;
    utils.showLoading();


    var option = {
        header: { "Content-Type": "application/x-www-form-urlencoded" },   //post提交需要加这一行
        url: config.api.ordering_post,
        method:'POST',
        data: {
          aid:aid,
          id:ordering_id,
          uid:uid,
          pid:pid,
          price_id:price_id,
          username:username,
          tel:tel,
          area:area,
          address:address,
          num:num,
        }
    };

    //发送数据请求
    utils.request(option,
        function (res) {
          utils.hideLoading();
          if(res.data.result == 'success'){
              utils.hideLoading();
              utils.alert_msg('订单提交成功!','success');

              //订单号
              var ordering_id = res.data.id;
              var totalPrice = that.data.totalPrice;
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
                  attach: that.data.article.title+'-门票',
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


          }
        }
    );


    // wx.navigateTo({
    //   url: '',
    // })
  }

})
