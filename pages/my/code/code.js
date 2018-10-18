var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp()
var that;
Page({
    data: {
        "imageBytes": "",
        link:""
    },
    noneWindows: function () {
        this.setData({
            imageBytes: ""
        })
    },
    onLoad: function () {
       that = this;

     
      app.getUserInfo(function (userInfo) {
        console.log(userInfo)
        //get user info and show them on page
        that.setData({
          userInfo: userInfo,


        })
      })
    },
    formSubmit: function (event) {
        var path = event.detail.value.path;
        var width = event.detail.value.width;
        var that = this;
        that.setData({
          link:path
        })
      //generate QR code
        Bmob.generateCode({  "path": path, "width": width}).then(function (obj) {
            console.log(obj);
            that.setData({
                imageBytes: obj.imageBytes
            })

        }, function (err) {

            common.showTip('失败' + err);
        });
    }
})