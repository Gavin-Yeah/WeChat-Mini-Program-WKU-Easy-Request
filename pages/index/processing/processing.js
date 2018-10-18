var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var that;
var objectid;
var photo;
var userid, facilitytype, facilitylocation, repairtel, repairname;
var description;
var telrepair,telmanager;
Page({

  data: {
  
ismanager:""
  
  },

  onLoad: function (options) {
    photo=null;
    description=null;
    wx.showLoading({
      title: '加载中Loading',
    })
    that = this;
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
        telrepair = result.get("repair").tel;
        telmanager = result.get("manager").tel;
        userid=result.get("user").openid;
        repairname=result.get("repair").name;
        facilitytype=result.get("facilitytype");
        facilitylocation=result.get("facilitylocation")
        // The object was retrieved successfully.
        that.setData({
          result:result


          // username:result.get("user.name")
        })
        console.log("result" + result.get("user").name);
        wx.hideLoading()
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
  },

 




  dialrepair: function () {//dial the tel no. of repair person
    wx.makePhoneCall({
      phoneNumber: telrepair 
    })

  },
  dialmanager: function () {
    wx.makePhoneCall({
      phoneNumber: telmanager
    })

  },


  description: function () {
    if (description!= null) {
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
    })
    }

  }
  ,
  photo: function () {
    if (photo != null) {
    console.log(photo)
    wx.previewImage({
      current: photo,
      urls: [photo]
    })}
  },
  submit:function(e){

    var request = Bmob.Object.extend("request");
    var query = new Bmob.Query(request);
    // change request info
    query.get(objectid, {
      success: function (result) {
        // search object by objectid and update that
        var date = new Date();
        result.set('finish', date);
        result.set('state', 2);
        result.save();
        wx.showModal({
          title: 'Tip',
          content: '成功Sucess',
          showCancel: false,
          confirmText: "OK",
          confirmColor: "#007AFF",
          success: function (res) {
            if (res.confirm) {


             //send message to requester using message template
              console.log("form" + e.detail.formId)
              var temp = {
                "touser": userid,
                "template_id": "zwVm-j2qFmMJulwUYwHTrshBzxHjNhZHz04EpnKW8nQ",
                "page": "",
                "form_id": e.detail.formId,
                "data": {
                  "keyword1": {
                    "value": "Location: " + facilitylocation
                  },
                  "keyword2": {
                    "value": "Repair Person: " + repairname
                  },
                  "keyword3": {
                    "value": "Facility: " + facilitytype
                  },
                  "keyword4": {
                    "value": "Finished At " + date
                  }
                },
                "emphasis_keyword": ""
              }
              Bmob.sendMessage(temp).then(function (obj) {
                console.log('发送成功Success')
              },
                function (err) {
                  console.log(err)
                });

              wx.reLaunch({
                url: '../../index/index',
              })




            }
          }
        })


        
        // The object was retrieved successfully.
      },
      error: function (object, error) {

      }
    });
  }
})