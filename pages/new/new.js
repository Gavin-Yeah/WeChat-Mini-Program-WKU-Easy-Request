// pages/new/new.js
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var array= ['Computer', 'Projector', 'Air-Conditioner', 'Whiteboard'];
var objectid,openid;
var tempFilePath=[];
var url="";
var currentuser;
var image= false;
var file;
var picname;
Page({

  /**
   *initialize data on page
   */
  data: {
    
    imgUrl:'',
    openid: "",
    name:"",
    tel:"",
    facilitytype:"",

  }, 
  formSubmit: function (e) {
    file=null;
    if (e.detail.value.facilitytype == "" || e.detail.value.facilitylocation == "" || e.detail.value.facilitytype == null || e.detail.value.facilitylocation == null){
      wx.showModal({
        title: 'Tip',
        content: 'Type or Location is NULL',
        showCancel: false,
        confirmText: "OK",
        confirmColor: "#007AFF",
        success: function (res) {

        }
      })
    }
   else{
     console.log("tempfile in submit " +tempFilePath[0])
     if(tempFilePath[0]!=null){
       console.log("temp is "+tempFilePath[0])
     wx.showNavigationBarLoading()
     var newDate = new Date();
     var newDateStr = newDate.toLocaleDateString();
     var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
     if (extension) {
       extension = extension[1].toLowerCase();
       picname = newDateStr + "." + extension;//name of uploaded image
       file = new Bmob.File(picname, tempFilePath);
       file.save().then(function (res) {
         wx.hideNavigationBarLoading()
         url = res.url();
         console.log("url is" + url);





         
       }, function (error) {
         console.log(error)
       });
     }
     }




    
   
    var Request = Bmob.Object.extend("request");
    var request = new Request();
    request.set("user", currentuser);
    request.set("facilitytype", e.detail.value.facilitytype);
    request.set("facilitylocation", e.detail.value.facilitylocation);
    console.log("url is "+url);
    if(file){
    request.set("photo", file);}
    request.set("state",0);
    request.set("description", e.detail.value.description );
    request.save(null, {
      success: function (result) {
        tempFilePath=[];
        wx.reLaunch({
          url: '../index/index'
        })
        
        console.log(result)
        console.log("Success, objectId:" + result.id);
      },
      error: function (result, error) {
        console.log('failure');
        common.showModal('反馈失败 Fail');
      }
    });


 
   }
 

   


  },


  onLoad: function (options) {

    if (wx.getStorageSync("name") == "please enter real name") {
      wx.redirectTo({
        url: '/pages/my/name/name',
      })
    }
    else if (wx.getStorageSync("tel") == "please enter tel") {
      wx.redirectTo({
        url: '/pages/my/tel/tel',
      })
    }
    wx.showLoading({
      title: '加载中Loading',
    })
    var that = this;
openid=wx.getStorageSync("openid")
    var user = Bmob.Object.extend("user");
    var query = new Bmob.Query(user);
    query.equalTo("openid", openid);
    console.log("openid in new "+openid)
    query.first({
      success: function (results) {
        console.log(results);
        currentuser=results;
        var name = results.get("name");
        var tel = results.get("tel");
       objectid = results.id;
       wx.hideLoading()
        wx.setStorageSync('name', name)
        wx.setStorageSync('tel', tel)
        wx.setStorageSync('objectid', objectid)
        that.setData({
          name: name,
          tel: tel,
        })
      }

    })


    //search facility info
    
    
    var facility = Bmob.Object.extend("facility");
    var query1 = new Bmob.Query(facility);
    if (options.facilityid){  
     var facilityid = options.facilityid ;
      console.log("facilityid=" + facilityid);
    query1.get(facilityid, {
      success: function (result) {
        // The object was retrieved successfully.
        that.setData({
          facilitytype:result.get("name"),
          location: result.get("location")
        })
        console.log("type" + result.get("name"));
        console.log("location" + result.get("location"));
      },
      error: function (result, error) {
        console.log("查询失败Failue");
      }
    });
    } 
  
    
  },




  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['Album', 'Photo'],
      itemColor: "#99ccff",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        image=true;
        tempFilePath = [res.tempFilePaths[0]];
        console.log("temfilepath: "+tempFilePath);
      


        

        


      }
    })
  }



})