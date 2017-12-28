var currentPage = 1;//当前页,默认 第一页

var config = require('../../utils/config');
var utils = require('../../utils/util.js');

const app = getApp()
var aid = 0;
var uid = 0;

Page({
  data: {
    isMatch: true,
    detail:{},
    type:{},
    comment_num:0,
    comment_list:[],
    player_a:{},
    player_b:{},
    article_list:{},
    playvideos:1,
    textareadata:'',
    media:config.api.url+"/media/",
  },

  onLoad: function (options) {
      aid = options.id
      var that = this;
      that.fetchData();
      that.fetchData_comment();

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
                          }
                    });
                 }
            });
        },
        fail: function(){
      //登陆
      wx.login({
          success:function(resLogin){

              var code = resLogin.code; //返回code
              wx.request({
                     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.appId + '&secret=' + config.secret + '&js_code=' + code + '&grant_type=authorization_code',
                     data: {},
                     header: {
                       'content-type': 'json'
                     },
                     success: function (res) {
                       var openid = res.data.openid; //返回openid
                       wx.getUserInfo({
                           success:function(res){
                               var userInfo = res.userInfo;
                               var option = {
                                   header: { "Content-Type": "application/x-www-form-urlencoded" },   //post提交需要加这一行
                                   url: config.api.userinfo_post,
                                   method:'POST',
                                   data: {
                                     openid:openid,
                                     nickName:userInfo.nickName,
                                     avatarUrl:userInfo.avatarUrl,
                                     gender:userInfo.gender,
                                     city:userInfo.city,
                                     province:userInfo.province,
                                     country:userInfo.country,
                                     language:userInfo.language,
                                   }
                               };

                               utils.request(option,
                                   function (res) {
                                     if(res.data.result == 'success'){
                                        uid = res.data.uid;
                                     }
                               });

                           }
                       });

                     }
                });
          }
      });
      //END
    }
  });


  },

  onShow: function() {
    var that = this;
    //currentPage = 1;
    that.fetchData();
    that.fetchData_comment();
  },

  fetchData: function () {//获取列表信息
      var that = this;
      utils.showLoading();
      var option = {
          url: config.api.video + aid,
          data: {}
      };
        //发送数据请求
        utils.request(option,
            function (res) {
                var list = res.data.list;
                var detail = list[0].fields;

                var type = res.data.type;
                type = type[0].fields;

                var player_a = res.data.player_a;
                var pk = player_a[0].pk;
                player_a = player_a[0].fields;
                player_a['pk'] = pk;

                var player_b = res.data.player_b;
                var pk = player_b[0].pk;
                player_b = player_b[0].fields;
                player_b['pk'] = pk;

                var article_list = res.data.article_list;

                that.setData({
                  detail:detail,
                  type:type,
                  player_a:player_a,
                  player_b:player_b,
                  article_list:article_list,
                  comment_num : res.data.comment_num,
                });

                wx.setNavigationBarTitle({
                  title: detail.title,
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
              url: config.api.comment_list + "aid/" + aid +"/PageNo/"+currentPage,
              data: {}
          };
            //发送数据请求
            utils.request(option,
                function (res) {
                    var list = res.data.list;
                    that.setData({
                        comment_list:that.data.comment_list.concat(list),
                    });
                });

              currentPage++;
              utils.hideLoading();
        },



  bindFormSubmit: function(e) {
    var that = this;
    var option = {
        url: config.api.comment_post  + aid +"/0/"+uid+"/"+e.detail.value.textarea,
        data: {}
    };

    //发送数据请求
    utils.request(option,
        function (res) {
          if(res.data.result == 'success'){
              utils.alert_msg('评论成功!','success');
              that.setData({
                comment_num : res.data.comment_num,
                textareadata:'',
              });

              currentPage = 1;
              that.setData({
                  comment_list:[],
              });
              that.fetchData_comment();
          }
        }
    );
  },



  goComment:function(){
      wx.navigateTo({
        url: '../comment/comment?id='+aid
      })
    },


  goPlayer:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../player/player?id='+data.id
    })
  },



  buy:function(e){
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/area/area?id='+data.id+"&aid="+aid,
    })
  },


  newVideo:function(){
    wx.redirectTo({
      url:'/pages/videoDetail/videoDetail'
    })
  },
  tabMatch:function(){
    var that=this;
    var isMatch = that.data.isMatch;
    if(isMatch){
      isMatch=false;
    }else{
      isMatch=true;
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
      title: that.data.detail.title,
      path: '/pages/videoDetail/videoDetail?id='+aid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },






})
