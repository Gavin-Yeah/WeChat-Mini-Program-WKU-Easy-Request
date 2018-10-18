// pages/my/my.js
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp()
var openid,objectid,name,tel;
var ismanager;

Page({
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
,
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    name:'',
    tel:'',
   
    ismanager:''
 
  },

  // User login 
  onLoad: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中Loading',
    })
    //get global function from app.js
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //update data
      that.setData({
        userInfo: userInfo,
      })
        
    })

    
    var that = this;

 /*   wx.getStorage({
      key: 'openid',
      success: function (res) {
        openid=res.data
        console.log(res.data)
      }
    })*/


    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          console.log(res.code)

          Bmob.User.requestOpenId(res.code, {
            success: function (result) {
              
                openid= result.openid
                wx.setStorage({
                  key: "objectid",
                  data: objectid
                })
              console.log("requested openid is"+result.openid)


              //search user identity, name and tel number from Bmob databse 
              var user = Bmob.Object.extend("user");
              var query = new Bmob.Query(user);
           
              query.equalTo("openid", openid);
              query.find({
                success: function (results) {
                  console.log("openid in search data is" + openid)
                  name = results[0].get("name");
                  tel = results[0].get("tel");
                  console.log("name is" + name)
                  console.log("tel is" + tel)
                  objectid = results[0].id;
                  ismanager = results[0].get("manager");
                  //store data into local storage
                 
                  wx.setStorage({
                    key: "ismanager",
                    data: ismanager
                  })

                  console.log("objectid in My page is" + objectid)
                  wx.setStorageSync('name', name)
                  wx.setStorageSync('tel', tel)
                  wx.setStorageSync('objectid', objectid)
                  that.setData({
                    name: name,
                    tel: tel,
                    ismanager: ismanager,
                    objectid: objectid
                  })
                  wx.hideLoading()



                }

              })






            },
            error: function (error) {
              // Show the error message somewhere
              console.log("Error: " + error.code + " " + error.message);
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
          common.showTip('获取用户登录态失败！', 'loading');
        }
      }
    });





    
 


  },


  
  //show About App information window when a user click the button
  about: function (e) {
    wx.showModal({
      title: 'Tip',
      content: 'WKU Easy Repair is a facility repair system for WKUers.Please edit your name and tel at 1st use.温肯简修是一个为温肯师生定制报修平台，请在第一次使用时先输入姓名电话号码。',
      showCancel:false,
      confirmText:"确定OK",
      confirmColor: '#0377f9'

    })
  }
})
