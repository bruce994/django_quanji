var config = require('../../utils/config');
var utils = require('../../utils/util.js');

//获取应用实例
const app = getApp()
var openid = '';
var uid = 0;

Page({
  data: {
    userInfo:'',
  },

  onLoad: function () {
    var that = this;

    wx.checkSession({
      success: function(e){
          //var uid = wx.getStorageSync('uid')
          //console.log(uid);
          wx.getUserInfo({
              success:function(res){
                  var userInfo = res.userInfo;
                  that.setData({
                    userInfo:userInfo,
                  });
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












  goPlayer:function(){
    wx.switchTab({
      url: '/pages/data/data',
    })
  },
  goBuy:function(){
    wx.switchTab({
      url: '/pages/video/video',
    })
  },
  goMyOrder:function(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?uid='+uid,
    })
  },

  goLession:function(){
    wx.navigateTo({
      url: '/pages/lession/lession',
    })
  },

})
