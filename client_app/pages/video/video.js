//index.js
//获取应用实例
var keyword = ''; //搜索
var currentPage = 1;//当前页,默认 第一页
var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()

var videoIndex = "0";
var sortNum = 1;
var typeid = 0;

Page({

  data:{
      isMatch: true,
      list:[],
      type:{},
      playvideos:1,
      media:config.api.url+"/media/",
    },

    onLoad: function (options) {
        currentPage = 1;
        var that = this;
        console.log(options);
        if(Object.keys(options).length > 0){
            typeid = options.id;
        }
        that.fetchData_type();
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
            list: [],
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


      fetchData_type: function () {//获取列表信息
          var that = this;
          utils.showLoading();
          var option = {
              url: config.api.type_list,
              data: {}
          };
          //发送数据请求
          utils.request(option,
              function (res) {
                  var type = res.data.list;
                  for (var i = 0; i < type.length; i++) {
                    type[i]['isCheck'] = 0;
                  }
                  that.setData({
                    type:type
                  });
                  utils.hideLoading();
              })
      },


    fetchData: function () {//获取列表信息
        var that = this;
        utils.showLoading();
        if(typeid == 0){
          var url = config.api.video_list+"PageNo/"+currentPage;
        }else{
          var url = config.api.video_list+typeid+"/PageNo/"+currentPage;
        }
        var option = {
            url: url,
            data: {}
        };

        //发送数据请求
        utils.request(option,
            function (res) {
                var tmp = res.data;
                var list = tmp.list;
                for (var i = 0; i < list.length; i++) {
                  list[i]['sort'] = sortNum++;
                  list[i]['isPlay'] = 0;
                }
                that.setData({
                  list:that.data.list.concat(tmp.list)
                });

                currentPage++;
                utils.hideLoading();
            })

    },



    bindViewTap: function (e) {
      var data = e.currentTarget.dataset;
      wx.navigateTo({
        url: '../videoDetail/videoDetail?id='+data.id
      })
    },

    bindViewPlay: function (e) {
      var that = this;
      var idx = e.currentTarget.dataset.idx;
      console.log(e.currentTarget.dataset);
      var list = that.data.list;
      list[idx]['isPlay'] = 1;
      that.setData({
        list:list,
      });
    },


    onShareAppMessage: function (res) {
      var that = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title: '战东南搏击-赛事',
        path: '/pages/video/video',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },

    tabMatch:function(e){
      var that=this;
      var idx = e.currentTarget.dataset.idx;
      var type = that.data.type;
      for (var i = 0; i < type.length; i++) {
        type[i]['isCheck'] = 0;
      }
      type[idx]['isCheck'] = 1;
      that.setData({
        type:type,
        list:[],
      });

        typeid = type[idx]['pk'];
        currentPage = 1;
        that.fetchData();

    },


})
