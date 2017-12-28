var currentPage = 1;//当前页,默认 第一页

var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()
var aid = 0;
var uid = 0;


Page({
  data: {
    comment_list:[],
    comment_num:0,
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
      aid = options.id
      var that = this;
      that.fetchData_comment();
  },

  onShow: function() {
    var that = this;
    currentPage = 1;
    //that.fetchData_comment();
  },

      onPullDownRefresh: function () { //下拉刷新
          currentPage = 1;
          this.setData({
            comment_list:[],
          });
          this.fetchData_comment();
          setTimeout(function () {
              wx.stopPullDownRefresh();
          }, 1000);
      },
      onReachBottom: function () { // 上拉加载更多
          // Do something when page reach bottom.
          this.fetchData_comment();
      },


        fetchData_comment: function () {
            var that = this;
            utils.showLoading();
            var option = {
                url: config.api.comment_list + "wid/" + aid +"/PageNo/"+currentPage,
                data: {}
            };
              //发送数据请求
              utils.request(option,
                  function (res) {
                      var list = res.data.list;
                      that.setData({
                          comment_list:that.data.comment_list.concat(list),
                          comment_num:res.data.comment_num,
                      });
                  });

                currentPage++;
                utils.hideLoading();
          },



})
