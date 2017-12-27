//index.js
//获取应用实例

var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()
var aid = 0;

Page({
  data: {
    isMatch: true,
    player:[],
    type:{},
    player_video:{},
    playvideos:1,
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
      aid = options.id
      var that = this;
      that.fetchData();
  },

  onShow: function() {
    var that = this;
    //that.fetchData();
  },

  fetchData: function () {//获取列表信息
      var that = this;
      utils.showLoading();
      var option = {
          url: config.api.player + aid,
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
                });

                wx.setNavigationBarTitle({
                  title: player.username,
                });
                utils.hideLoading();

                //增加播放量
                /*
                var list = res.data.array;
                var aid = list['id'];
                var mid = list['mid'];
                var option = {
                    url: config.api.count + "play" + "&time=" + Date.now(),
                    data: {
                        "aid": aid,
                        "mid": mid
                    }
                };
                utils.request(option,function (res) {});
                */
                //END

            })
    },



  goVideoDetail:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../videoDetail/videoDetail?id='+data.id
    })
  },



  tabMatch: function () {
    var that = this;
    var isMatch = that.data.isMatch;
    if (isMatch) {
      isMatch = false;
    } else {
      isMatch = true;
    }
    that.setData({
      isMatch: isMatch
    })
  },


  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: that.data.player.username,
      path: '/pages/player/player?id='+aid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },








})
