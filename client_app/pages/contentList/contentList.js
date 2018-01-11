//获取应用实例

var config = require('../../utils/config');
var utils = require('../../utils/util.js');
var currentPage = 1;//当前页,默认 第一页

const app = getApp()

Page({
  data: {
    isMatch: true,
    article1:{},
    article2:{},
    article2_1:{},
    article2_2:{},
    article2_3:{},
    article2_4:{},
    article3:[],
    playvideos:1,
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
      var that = this;
      that.fetchData();
  },

  onShow: function() {
    var that = this;
    currentPage = 1;
    //that.fetchData();
  },

  onPullDownRefresh: function () { //下拉刷新
      currentPage = 1;
      this.setData({
        article3:{},
      });
      this.fetchData();
      setTimeout(function () {
          wx.stopPullDownRefresh();
      }, 1000);
  },
  onReachBottom: function () { // 上拉加载更多
      // Do something when page reach bottom.
      this.fetchData();
  },



  fetchData: function () {//获取列表信息
      var that = this;
      utils.showLoading();
      var option = {
          url: config.api.index+"PageNo/"+currentPage,
          data: {}
      };

        //发送数据请求
        utils.request(option,
            function (res) {
                var article1 = res.data.article1;
                var article2 = res.data.article2;
                var article3 = res.data.article3;
                for (var i = 0; i < article3.length; i++) {
                  var tmp = article3[i]['fields']['pub_date'].replace("T"," ");
                  tmp = tmp.substr(5,11);
                  article3[i]['fields']['pub_date'] = tmp;
                }
                var article2_1 = '';
                var article2_2 = '';
                var article2_3 = '';
                var article2_4 = '';

                var tmp;
                if(article2.length > 0){
                   article2_1 = article2[0];
                   tmp = article2_1.fields.pub_date;
                   article2_1.fields.pub_date  = tmp.substr(0,10);
                }


                if(article2.length > 1){
                   article2_2 = article2[1];
                   tmp = article2_2.fields.pub_date;
                   article2_2.fields.pub_date  = tmp.substr(0,10);
                }

                if(article2.length > 2){
                   article2_3 = article2[2];
                   tmp = article2_3.fields.pub_date;
                   article2_3.fields.pub_date  = tmp.substr(0,10);
                }

                if(article2.length > 3){
                   article2_4 = article2[3];
                   tmp = article2_4.fields.pub_date;
                   article2_4.fields.pub_date  = tmp.substr(0,10);
                }




                that.setData({
                  article1:article1[0],
                  article2_1:article2_1,
                  article2_2:article2_2,
                  article2_3:article2_3,
                  article2_4:article2_4,
                  article3:that.data.article3.concat(article3),
                });

                currentPage++;
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


      videoPlay: function (e) {
        var that = this;
        var data = e.currentTarget.dataset;
        var id = data.id;
        if(id != videoIndex){
          this.videoContext = wx.createVideoContext('myVideo'+videoIndex);
          this.videoContext.pause();
          var list = that.data.list;
          list[videoIndex]['isPlay'] = 0;
          that.setData({
            list:list,
          });
        }
        videoIndex = id;

        //增加播放量
        /*
        var list = that.data.list;
        var aid = list[id]['id'];
        var mid = list[id]['mid'];
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

      },

  goContent:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../content/content?id='+data.id
    })
  },

  goMore:function(){
    wx.switchTab({
      url: '/pages/video/video',
    })
  },
  buy:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/area/area?id='+data.id+'&aid='+data.aid,
    })
  },
  newVideo:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../videoDetail/videoDetail?id='+data.id
    })
  },


  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '战东南搏击-咨询',
      path: '/pages/contentList/contentList',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },





})
