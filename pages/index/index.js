//index.js
//get bmob api
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp();
var that;
var ismanager, objectid;

Page({

  data: {
    //initialize data of page
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    submit: [],
    process: [],
    finish: [],
    navbar: ['新报修Submitted', '待维修Processing', '已检修History'],
    currentTab: 0 
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //refresh when pulling down the top of page 

    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //stop loading when finished
      wx.stopPullDownRefresh() //stop pull downrefresh
    }, 1500);

  }
,
  navbarTap: function (e) {
    this.setData({
      //set different view (submitted,processing&history)
      currentTab: e.currentTarget.dataset.idx
    })
  } ,
  //load page
  onLoad: function () {
    that = this;
    wx.showLoading({
      title: '加载中Loading',
    })
    wx.showShareMenu({
      withShareTicket: true 
    })
    wx.getStorage({ //get storage of objectid
      key: 'objectid',
      success: function (res) {
        objectid = res.data
        console.log(res.data)
      }
    })
    //search user info in user table using objectid
    var user = Bmob.Object.extend("user");
    var query = new Bmob.Query(user);
    query.get(objectid, {
      success: function (result) {
        // The object was retrieved successfully.
         ismanager=result.get("manager");
        console.log(objectid + "ismanager" + ismanager)
        wx.setStorageSync("ismanager", ismanager)
        wx.hideLoading()
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });


  },
  //click button to turn to add page
  add: function () {
    var objectid = wx.getStorageSync("objectid");
    if (wx.getStorageSync("name") == "init name"){
      wx.redirectTo({
        url: '/pages/my/name/name',
      })
    }
    else if (wx.getStorageSync("tel") == "init tel"){
      wx.redirectTo({
        url: '/pages/my/tel/tel',
      })
    } else{
    wx.navigateTo({
      url: '../new/new'
    })}
  },
  //show the different views, set window height
  onShow: function () {
    getsubmit(this);
    getprocess(this);
    getfinish(this);
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
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    }); 
    getsubmit(this);
    getprocess(this);
    getfinish(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    getsubmit(this);
    getprocess(this);
    getfinish(this);
  },
  inputTyping: function (e) {
    //search data
    getsubmit(this,e.detail.value);
    getprocess(this,e.detail.value);
    getfinish(this,e.detail.value);
    console.log(e.detail.value)
    this.setData({
      inputVal: e.detail.value
    });
  }

})


//submitted view function
function getsubmit(t, k) {
  that = t;
  var request = Bmob.Object.extend("request");
  var query = new Bmob.Query(request);
  var query1 = new Bmob.Query(request);

  //search box
  if (k) {
    query.equalTo("facilitytype", { "$regex": "" + k + ".*" } );
    query1.equalTo("facilitylocation", { "$regex": "" + k + ".*" });
  }
  query.equalTo("state", 0);
  query1.equalTo("state", 0);
  //match data
  query.ascending('createdAt');
  query.include("user")
  query.include("manager")
  query.include("repair")
  // all data
  query.limit(that.data.limit);

  var mainQuery = Bmob.Query.or(query, query1);
  mainQuery.find({
    success: function (results) {
      // find data from table
      console.log(results);
      that.setData({
       submit: results
      })
    },
    error: function (error) {
      console.log("查询失败failure: " + error.code + " " + error.message);
    }
  });
}

function getprocess(t, k) {
  that = t;
  var request = Bmob.Object.extend("request");
  var query = new Bmob.Query(request);
  var query1 = new Bmob.Query(request);

  if (k) {
    query.equalTo("facilitytype", { "$regex": "" + k + ".*" });
    query1.equalTo("facilitylocation", { "$regex": "" + k + ".*" });
  }
  query.equalTo("state", 1);
  query1.equalTo("state", 1);
  

  query.ascending('createdAt');
  query.include("user");
  query.include("manager");
  query.include("repair");
  query.limit(that.data.limit);

  var mainQuery = Bmob.Query.or(query, query1);
  mainQuery.find({
    success: function (results) {
      console.log(results);
      that.setData({
        process: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}


function getfinish(t, k) {
  that = t;
  var request = Bmob.Object.extend("request");
  var query = new Bmob.Query(request);
  var query1 = new Bmob.Query(request);

  if (k) {
    query.equalTo("facilitytype", { "$regex": "" + k + ".*" });
    query1.equalTo("facilitylocation", { "$regex": "" + k + ".*" });
  }
  query.equalTo("state", 2);
  query1.equalTo("state", 2);

  // query.equalTo("title", k);

  query.ascending('createdAt');
  query.include("user")
  query.include("manager")
  query.include("repair")
  query.limit(that.data.limit);

  var mainQuery = Bmob.Query.or(query, query1);
  mainQuery.find({
    success: function (results) {
      console.log(results);
      that.setData({
        finish: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}