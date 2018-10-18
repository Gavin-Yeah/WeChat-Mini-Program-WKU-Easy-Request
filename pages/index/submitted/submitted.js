
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var that;
var photo;
var description;
var objectid, ismanager;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    objectArray: [],
showaccept:false,
showreject:false,
 ismanager:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    photo=null;
    description = null;
    that = this;
    wx.showLoading({
      title: '加载中Loading',
    })
    wx.getStorage({
      key: 'ismanager',
      success: function (res) {
       
        that.setData({
          ismanager: res.data
        })
        console.log(res.data)
      }
    })
  
 
   objectid = options.objectId;
    var request = Bmob.Object.extend("request");
    var query = new Bmob.Query(request);
    query.include("user");
    query.include("manager");
    query.include("repair");
    query.get(objectid, {
      success: function (result) {
        if (result.get("photo") != null) {
          photo = result.get("photo").url;
        } if (result.get("description") != null) {
          description = result.get("description");
        }
        
        // The object was retrieved successfully.
        that.setData({
          result: result
        })
        console.log("result" + result.get("user").name);
        wx.hideLoading()
        console.log("photo is " + photo)
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
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

 submit: function () {
 wx.navigateTo({
   url: 'repair/repair?objectid='+objectid,
   success: function(res) {},
   fail: function(res) {},
   complete: function(res) {},
 })
 },
 reject: function () {
   wx.navigateTo({
     url: 'reject/reject?objectid=' + objectid,
     success: function (res) { },
     fail: function (res) { },
     complete: function (res) { },
   })
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
  
  },


  description: function () {
    if (description != null) {
      wx.showModal({
        title: 'Description',
        content: description,
        showCancel: false,
        confirmText: "OK",
        confirmColor: "#007AFF",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })}

  }
  ,
  photo: function () {
 
    console.log(photo)
    if (photo != null) {
      wx.previewImage({
        current: photo,
        urls: [photo] // 需要预览的图片http链接列表
      })
    }
  }
})