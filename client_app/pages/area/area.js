
var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()
var id = 0;
var aid = 0;
var price_id = 0;

Page({
  data: {
    detail:{},
    price:{},
    article:{},
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
    id = options.id;
    aid = options.aid;
    var that = this;
    that.fetchData();
  },

  onShow: function() {
    var that = this;
    //currentPage = 1;
    that.fetchData();
  },

  fetchData: function () {  //获取列表信息
      var that = this;
      utils.showLoading();


      var option = {
          url: config.api.area + id,
          data: {}
      };
        //发送数据请求
        utils.request(option,
            function (res) {
                var list = res.data.detail;
                var detail = list[0].fields;
                var price = res.data.price;

                //增加selectColor
                for (var i = 0; i < price.length; i++) {
                     price[i]['selectColor'] = '#dddddd';
                }
                //END

                that.setData({
                  detail:detail,
                  price:price,
                });

                wx.setNavigationBarTitle({
                  title: detail.title,
                });
            });


            var option = {
                url: config.api.video + aid,
                data: {}
            };
              //发送数据请求
              utils.request(option,
                  function (res) {
                      var list = res.data.list;
                      var article = list[0].fields;
                      var tmp = article.game_date;
                      article.game_date = tmp.replace("T"," ");
                      that.setData({
                        article:article,
                      });

                  });

            utils.hideLoading();

    },


  goOrder:function(){

    if(price_id == 0){
      wx.showToast({
        title: '选择票价',
        image: '../../images/error.png',
        duration: 2000
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/order/order?price_id='+price_id+"&pid="+id+"&aid="+aid,
    })
  },


  selectPrice:function(e){
    var that = this;
    var price = that.data.price;
    for (var i = 0; i < price.length; i++) {
         price[i]['selectColor'] = '#dddddd';
    }

    var idx = e.currentTarget.dataset.idx;
    price[idx]['selectColor'] = "red";
    that.setData({
      price:price,
    });

    price_id = e.currentTarget.dataset.id;


  },


})
