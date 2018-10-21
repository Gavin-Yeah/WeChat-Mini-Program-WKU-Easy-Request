//index.js
//获取应用实例
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp();
var that;
var userid,currentuser;
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

  noneWindows: function () {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
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
onShow:function(){
    wx.getStorage({
      key: 'objectid',
      success: function (res) {
        userid = res.data
        console.log(res.data)
      }
    })
    var User = Bmob.Object.extend("user");
    var query3 = new Bmob.Query(User);
    query3.get(userid, {
      success: function (result) {
        console.log("current user is "+userid)
        // The object was retrieved successfully.
        currentuser = result;
        console.log(userid);
    
    if(currentuser.id==userid){
     
        var request = Bmob.Object.extend("request");
        var query = new Bmob.Query(request);
        var query2 = new Bmob.Query(request);
        query.equalTo("user", currentuser);
        query2.equalTo("manager", currentuser);
        var mainQuery = Bmob.Query.or(query, query2);
        mainQuery.descending('createdAt');
        mainQuery.include("user");
        mainQuery.include("manger");
        mainQuery.include("repair");
        mainQuery.include("facility");
        // 查询所有数据
        mainQuery.limit(that.data.limit);
        mainQuery.find({
          success: function (results) {

console.log("release result is"+ results[0].get("name"))
            that.setData({
              List: results
            })
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
    }
    
    
    
    
    
      },
      error: function (result, error) {
        console.log("查询失败");
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
  toAdd: function () {
 
    wx.navigateTo({
      url: '../../new/new'
    })
  },
  closeAddLayer: function () {
    that.setData({
      modifyDiarys: false
    })
  },
  click:function(e){
    console.log("/pages/index/history/history?objectId=" + e.target.id);
    var state= e.target.dataset.state;
    console.log(e.target.dataset.state)
    if(state===0){
      wx.navigateTo({
        url: "/pages/index/submitted/submitted?objectId=" + e.target.id
      })
}
if(state===1){
  wx.navigateTo({
    url: "/pages/index/processing/processing?objectId=" + e.target.id
  })
}
if(state===2){
  wx.navigateTo({
    url: "/pages/index/history/history?objectId=" + e.target.id
  })
}
  }

})
