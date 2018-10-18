// pages/my/editrepair/newrepair/newrepair.js
var Bmob = require('../../../../utils/bmob.js');
var common = require('../../../../utils/common.js');
var app = getApp()

var objectid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    data: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  ,
  formSubmit: function (e) {
    wx.showLoading({
      title: 'Loading',
    })
    var name = e.detail.value.name;
    var tel = e.detail.value.tel;

    var Repair= Bmob.Object.extend("repair");
    var repair = new Repair();
    repair.set("name", name);
    repair.set("tel", tel);
    //添加数据，第一个入口参数是null
    repair.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("创建成功, objectId:" + result.id);
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建日记失败');

      }
    });

  
  }
})