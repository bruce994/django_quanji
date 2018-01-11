
var config = require('../../utils/config');
var utils = require('../../utils/util.js');


const app = getApp()
var uid = 0;
var ordering_id = 0;
var openid = '';
var id = 0;
var teachid = 0;

Page({
  data: {
    username:'',
    tel:'',
    area:'',
    address:'',
    num:1,
    totalPrice:'',
    detail:{},
  },

  onLoad: function (options) {
    id = options.id;
    teachid = options.teachid;
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
                                     }else{
                                          that.login(config);
                                      }
                              });
                           }
                      });
                  },
                  fail: function(){
                    that.login(config);
                  }
    });

  },



    login: function(config){
      var that = this;
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
                       var openid = res.data.openid; //返回openid
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
                                          //wx.setStorageSync('uid', res.data.uid);
                                          var result = {"userInfo":userInfo,"openid":openid,"uid":res.data.uid};
                                          uid = res.data.uid;
                                          openid = openid;
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
    that.fetchData();
  },


  fetchData: function () {  //获取列表信息
      var that = this;
      utils.showLoading();

      var option = {
          url: config.api.lession_list + id,
          data: {}
      };
        //发送数据请求
        utils.request(option,
            function (res) {
                var list = res.data.list;
                var detail = list[0];
                that.setData({
                  detail:detail
                });
            });

          utils.hideLoading();
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




    sign11:function(){
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
            typeid:1,
            aid:id,
            pid:teachid,
            id:ordering_id,
            uid:uid,
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
                var totalPrice = that.data.detail.fields.price;
                totalPrice = totalPrice * 100;

                wx.request({
                  header: { "Content-Type": "application/x-www-form-urlencoded" },   //post提交需要加这一行
                  url: config.api.wxpay,
                  method:'POST',
                  data: {
                    appid:config.appId,
                    mch_id:config.mch_id,
                    body:'报名课程',
                    out_trade_no:ordering_id,  //商品订单号
                    total_fee:totalPrice,
                    //total_fee:1,
                    notify_url:config.api.wxpay_notify,
                    attach: '报名课程',
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

                        //商户订单支付失败需要生成新单号重新发起支付
                        var option = {
                            url: config.api.ordering_update+ordering_id,
                            data: {}
                        };
                        utils.request(option,function (res) {});
                        //END


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



    },












})
