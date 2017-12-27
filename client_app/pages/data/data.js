//index.js
//获取应用实例
var typeid = 0;
var keyword = ''; //搜索
var currentPage = 1;//当前页,默认 第一页
var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()

var videoIndex = "0";
var sortNum = 1;
var level_id = 0;

Page({

  data:{
      list:[],
      level:[],
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
        that.fetchData_level();
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



    fetchData_level: function () {//获取列表信息
        var that = this;
        var option = {
            url: config.api.app_choices,
            data: {}
        };
        //发送数据请求
        utils.request(option,
            function (res) {
                var level = res.data.level;
                for (var i = 0; i < level.length; i++) {
                  level[i].push(0);
                }
                that.setData({
                  level:level
                });
            })
    },



    fetchData: function () {//获取列表信息
        var that = this;
        utils.showLoading();

        if(level_id == 0){
          var url = config.api.player_list+"PageNo/"+currentPage;
        }else{
          var url = config.api.player_list+level_id+"/PageNo/"+currentPage;
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
                  list:that.data.list.concat(tmp.list),
                });
                currentPage++;
                utils.hideLoading();
            })

    },

    bindViewTap: function (e) {
      var data = e.currentTarget.dataset;
      wx.navigateTo({
        url: '../player/player?id='+data.id
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
        title: '战东南搏击-选手',
        path: '/pages/data/data',
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
      var level = that.data.level;
      for (var i = 0; i < level.length; i++) {
        level[i][2] = 0;
      }
      level[idx][2] = 1;
      that.setData({
        level:level,
        list:[],
      });

        level_id = level[idx][0];
        currentPage = 1;
        sortNum = 1;
        that.fetchData();
    },





})
