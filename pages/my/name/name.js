// pages/my/name/name.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp()
var name,objectid;


Page({

  /**
   * 页面的初始数据
   */
  data: {
  name:"",
  data:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    objectid=options.objectid;
    name=wx.getStorageSync('name');
 that.setData({
   name:name
 })

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
  formSubmit:function(e){
    var newname = e.detail.value.name;
    var user = Bmob.Object.extend("user");
    var query = new Bmob.Query(user);
    console.log("objectid in name formsubmit: " + objectid)
    // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
    query.get(objectid, {
      success: function (result) {

        // 回调中可以取得这个 diary 对象的一个实例，然后就可以修改它了
        result.set('name', newname);
  
        result.save();
        console.log("name" + name)


        wx.reLaunch({
          url: '/pages/my/my',
        })

        // The object was retrieved successfully.
      },
      error: function (object, error) {

      }
    });

   
   
    
  
}
})