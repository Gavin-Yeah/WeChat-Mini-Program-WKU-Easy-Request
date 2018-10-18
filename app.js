//Get Bmob API
var Bmob = require('utils/bmob.js')
var BmobSocketIo = require('utils/bmobSocketIo.js').BmobSocketIo;
Bmob.initialize("ac78b2a4ba1f5e0eb18e971037cbc555", "e2cb6f72850eb7954f2ad0defb250126");
BmobSocketIo.initialize("ac78b2a4ba1f5e0eb18e971037cbc555");

var objectid;
App({
  //Launch APP
  onLaunch: function () {
    //show loading window
    wx.showLoading({
      title: '加载中Loading',
    })
    console.log("welcome to wku er")
    //initialize a bmob user
    var user = new Bmob.User();

    //login wechat
      wx.login({
        success: function (res) {
          //login bmob with wechat 
          user.loginWithWeapp(res.code).then(function (user) {
            objectid=user.id;
       
            var openid = user.get("authData").weapp.openid;
            //set storage of openid&objectid
            wx.setStorage({
              key: "openid",
              data: openid
            })
            wx.setStorage({
              key: "objectid",
              data: objectid
            })
  
            if (user.get("nickName")) {
              // login after 1st time
              console.log(user.get("nickName"), 'res.get("nickName")');       
              wx.setStorageSync('openid', openid)
              wx.hideLoading()     
            } else {
               //store other info of the user
              wx.getUserInfo({
                success: function (result) {           
                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;
                
                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  // when store successfully, it will get userid
                  query.get(user.id, {
                    success: function (result) {
                      console.log("register successfully")
                      // bound the account
                      result.set('manager', 0);
                      result.set('nickName', nickName);
                      result.set("userPic", avatarUrl);
                      result.set("openid", openid);
                      result.save();
                  //store app user info into another table
                      console.log("begin register")
                      var user = Bmob.Object.extend("user");
                      var user = new user();
                      user.set("openid", openid);
                      user.set("manager", 0);
                      user.set("name", "init name")
                      user.set("tel", "init tel")
                      wx.hideLoading()
                      //add data
                      user.save(null, {
                        success: function (result) {
                          // set storage objectid of the user 
                          wx.setStorage({
                            key: "objectid",
                            data: result.id
                          })
                          console.log("save, objectId:" + result.id);                         
                        },
                        error: function (result, error) {
                          // failure
                          console.log('创建日记失败');
                        }
                      });
                    }
                  });
                    }
                  });
            }
          }, function (err) {
            console.log(err, 'errr');
          });
        }
      });
   
      wx.hideLoading() //hide loading
  },
  getUserInfo: function (cb) {   //get user info function
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //call login interface
      wx.login({
        success: function () {

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    objectid: objectid
  }
})