// pages/my/read/read.js
//获取应用实例
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp();
var that;
var feedback;
Page({
  data: {
    
  },
  onLoad: function () {

    that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

  },
 
  onShow: function () {

    var feedback = Bmob.Object.extend("feedback");
    var query = new Bmob.Query(feedback);
    query.include("user");
    query.descending('createdAt');
    // 查询所有数据
    query.find({
      success: function (results) {


        that.setData({
          List: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })


  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },


  click: function (e) {
    wx.showModal({
      title: '回馈Feedback',
      content: e.target.id,
      showCancel: false,
      confirmText: "OK",
      confirmColor: "#007AFF",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } 
      }
    })



  
  }

})
