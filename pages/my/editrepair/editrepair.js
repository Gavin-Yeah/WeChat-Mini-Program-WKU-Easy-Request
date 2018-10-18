// pages/my/editrepair/editrepair.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp()
var that;
Page({
  data: {
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    userInfo: 10,
    List: {},
    modifyDiarys: false
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中Loading',
    })
    that = this
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      })
    })
    wx.getSystemInfo({
      success: (results) => {
        //set window height on page
        that.setData({
          windowHeight: results.windowHeight,
          windowWidth: results.windowWidth
        })
      }
    })

  },
 
  onShow: function () {
    wx.showLoading({
      title: '加载中Loading',
    })

    var repair = Bmob.Object.extend("repair");
    var query = new Bmob.Query(repair);
   
//serach repair persons 
    query.limit(that.data.limit);
    query.find({
      success: function (results) {
wx.hideLoading()
        that.setData({
          List: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
 


  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  toAdd: function () {
    wx.navigateTo({
      url: 'newrepair/newrepair'
    })
  },
  closeAddLayer: function () {
    that.setData({
      modifyDiarys: false
    })
  },
  click: function (e) {
    console.log("edit/edit?objectid=" + e.currentTarget.id)
    var name=e.currentTarget.dataset.name;
    var tel = e.currentTarget.dataset.tel;
     wx.navigateTo({
        url: "edit/edit?objectid=" + e.currentTarget.id+"&tel="+tel+"&name="+name
      })
    
    
  }

})
