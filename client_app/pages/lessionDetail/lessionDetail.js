
var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()
var id = 0;
var teachid = 0;

Page({
  data: {
    detail:{},
    teach:{},
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
    id = options.id;
    var that = this;
    that.fetchData();

  },

  onShow: function() {
    var that = this;
    that.fetchData();
  },

  fetchData: function () {  //获取列表信息
      var that = this;
      utils.showLoading();

      var option = {
          url: config.api.lession_list + id,
          data: {}
      };
        //发送数据请求
        utils.request(option,
            function (res) {
                var list = res.data.list;
                var detail = list[0];

                var teach = detail.teach;
                for (var i = 0; i < teach.length; i++) {
                  teach[i]['isCheck'] = 0;
                }

                that.setData({
                  detail:detail,
                  teach:teach
                });
            });

          utils.hideLoading();
    },


  tabMatch:function(e){
    var that=this;
    var idx = e.currentTarget.dataset.idx;
    var teach = that.data.teach;
    for (var i = 0; i < teach.length; i++) {
      teach[i]['isCheck'] = 0;
    }
    teach[idx]['isCheck'] = 1;
    that.setData({
      teach:teach,
    });

    teachid = teach[idx]['pk'];

  },



    sign22:function(){
      var that = this;
      if(teachid == 0){
          utils.alert_msg('请选择教练','error');
          return;
      }

      wx.navigateTo({
        url: '../lessionOrder/lessionOrder?id='+id+'&teachid='+teachid,
      })

    },


})
