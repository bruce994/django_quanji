var uid = 0;
var currentPage = 1;//当前页,默认 第一页
var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()


Page({

  data:{
      list:[],
      media:config.api.url+"/media/",
    },

    onLoad: function (options) {
        currentPage = 1;
        var that = this;
        uid = options.uid;
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
            url: config.api.myOrder+uid+"/PageNo/"+currentPage,
            data: {}
        };

        console.log(option.url);

        //发送数据请求
        utils.request(option,
            function (res) {
                var tmp = res.data;
                var list = tmp.list;
                for (var i = 0; i < list.length; i++) {

                  var price = list[i]['price_place']['fields']['price'] * list[i]['fields']['num'];
                  list[i]['totalPrice'] = price;
                  list[i]['title']['fields']['game_date'] = list[i]['title']['fields']['game_date'].replace("T"," ");
                  if(list[i]['fields']['status'] == 0){
                    list[i]['status_text'] = '未支付';
                    list[i]['style1'] = '';
                  }else if (list[i]['fields']['status'] == 1) {
                    list[i]['status_text'] = '已支付';
                    list[i]['style1'] = 'color:#d02828;';

                  }



                }
                that.setData({
                  list:that.data.list.concat(tmp.list)
                });
                currentPage++;
                utils.hideLoading();
            })

    },



  goOrderDetail:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id='+data.id+'&uid='+data.uid
    })
  }

})
