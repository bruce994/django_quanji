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
        if(Object.keys(options).length > 0){
            typeid = options.id;
        }
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


    fetchData: function () {//获取列表信息
        var that = this;
        utils.showLoading();


        var option = {
            url: config.api.lession_list+"PageNo/"+currentPage,
            data: {}
        };

        //发送数据请求
        utils.request(option,
            function (res) {
                var tmp = res.data;
                var list = tmp.list;

                for (var i = 0; i < list.length; i++) {
                  list[i]['exercise_time'] = 11;
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
        url: '../lessionDetail/lessionDetail?id='+data.id
      })
    },


    onShareAppMessage: function (res) {
      var that = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title: '战东南搏击-课程',
        path: '/pages/lession/lession',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },


})
