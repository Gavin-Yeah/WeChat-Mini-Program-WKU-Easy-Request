// pages/requestinfo/requestinfo.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var that;
var photo;
var description;
var telrepair, telmanager;
Page({

  data: {
  

  
  },

  
  onLoad: function (options) {
    photo = null;
    description = null;
    wx.showLoading({
      title: '加载中Loading',
    })
    var that= this;
    var objectid = options.objectId;
    var request = Bmob.Object.extend("request");
    var query = new Bmob.Query(request);
    query.include("user");
    query.include("manager");
    query.include("repair");
    query.get(objectid, {
      success: function (result) {
        if (result.get("photo")!=null){
          photo = result.get("photo").url;
        } if (result.get("description") != null) {
          description = result.get("description");
        }
        telrepair = result.get("repair").tel;
        telmanager = result.get("manager").tel;
        // The object was retrieved successfully.
        that.setData({
          result:result
       })
        console.log("result"+result.get("user").name);
        wx.hideLoading()
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
  },


  dialrepair: function () {
    wx.makePhoneCall({
      phoneNumber: telrepair 
    })

  },
  dialmanager: function () {
    wx.makePhoneCall({
      phoneNumber: telmanager 
    })

  },

 
  description:function(){
    if (description != null) {
    wx.showModal({
      title: 'Description',
      content: description,
      showCancel:false,
      confirmText:"OK",
      confirmColor: "#007AFF",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定ok')
        } else if (res.cancel) {
          console.log('用户点击取消cancel')
        }
      }
    })
    }
  }
  
  ,
  photo:function(){
    console.log(photo)
      if(photo!= null){
    wx.previewImage({
      current:photo,
      urls: [photo] // the list of pic urls
    })}
  }
})