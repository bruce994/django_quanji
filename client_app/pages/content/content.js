//index.js
//获取应用实例

var config = require('../../utils/config');
var utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');


const app = getApp()
var aid = 0;
var uid = 0;

Page({
  data: {
    player:[],
    type:{},
    player_video:{},
    playvideos:1,
    comment_num:0,
    textareadata:'',
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
      aid = options.id
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
                          }else{
                            uid = utils.login(config);
                          }
                    });
                 }
            });
        },
        fail: function(){
              uid = utils.login(config);
          }
        });



  },

  onShow: function() {
    var that = this;
    //that.fetchData();
  },

  fetchData: function () {//获取列表信息
      var that = this;
      utils.showLoading();
      var option = {
          url: config.api.content + aid,
          data: {}
      };
        //发送数据请求
        utils.request(option,
            function (res) {
                var list = res.data.list;
                var player = list[0].fields;
                var player_video = res.data.player_video;
                that.setData({
                  player:player,
                  player_video:player_video,
                  comment_num : res.data.comment_num,
                });

                wx.setNavigationBarTitle({
                  title: player.title,
                });
                utils.hideLoading();

                //富文本
                WxParse.wxParse('html_content', 'html', player.content, that, 0);
                //END

            })
    },




      bindFormSubmit: function(e) {
        var that = this;
        var option = {
            url: config.api.comment_post  + "0/" + aid +"/"+uid+"/"+e.detail.value.textarea,
            data: {}
        };

        //发送数据请求
        utils.request(option,
            function (res) {
              if(res.data.result == 'success'){
                  wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 2000,
                    success: function(res) {
                      wx.navigateTo({
                        url: '../comment/comment?id='+aid
                      });
                    },
                  });

                  that.setData({
                    comment_num : res.data.comment_num,
                    textareadata:'',
                  });

              }
            }
        );
      },



      goComment:function(){
          wx.navigateTo({
            url: '../comment/comment?id='+aid
          })
        },



        onShareAppMessage: function (res) {
          var that = this;
          if (res.from === 'button') {
            // 来自页面内转发按钮
          }
          return {
            title: that.data.player.title,
            path: '/pages/content/content?id='+aid,
            success: function (res) {
              // 转发成功
            },
            fail: function (res) {
              // 转发失败
            }
          }
        }


})
