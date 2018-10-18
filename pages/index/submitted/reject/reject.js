// pages/index/submitted/reject/reject.js
var Bmob = require('../../../../utils/bmob.js');
var common = require('../../../../utils/common.js');
var userid,facilitytype,facilitylocation;
var objectid,managername,managertel,managerid;
var Request = Bmob.Object.extend("request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  objectid=options.objectid;

  wx.getStorage({
    key: 'objectid',
    success: function (res) {
      managerid = res.data
      console.log(res.data)
    }
  })

  var manager = Bmob.Object.extend("user");
  var query = new Bmob.Query(manager);
  query.get(managerid, {
    success: function (result) {
      // The object was retrieved successfully.
       managername=result.get("name");
       managertel=result.get("tel");
      
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
  formSubmit:function(e){

    var request = new Bmob.Query(Request);
    request.include("user");
    request.get(objectid, {
      success: function (result) {
        // The object was retrieved successfully.
        facilitytype = result.get("facilitytype");
        facilitylocation = result.get("facilitylocation");
        userid = result.get("user").openid;

        console.log(userid);
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });



  
    var query1 = new Bmob.Query(Request);
    query1.get(objectid, {
      success: function (object) {
        // The object was retrieved successfully.
        object.destroy({
          success: function (deleteObject) {
            console.log('删除日记成功Delete Success');
         
            console.log("form" + e.detail.formId)
            var temp = {
              "touser": userid,
              "template_id": "5WF2B3hzLmCAsD_NidVlvnoHLvZI9WnzPUvquspjSf8",
              "page": "",
              "form_id": e.detail.formId,
              "data": {
                "keyword1": {
                  "value": managername,
                },
                "keyword2": {
                  "value": facilitytype + " at " + facilitylocation
                },
                "keyword3": {
                  "value": e.detail.value.reason,
                },
                "keyword4": {
                  "value": "受理人电话Manager Tel: " + managertel,
                },
              },
              "emphasis_keyword": ""
            }
            Bmob.sendMessage(temp).then(function (obj) {
              console.log('发送成功Success')
              wx.reLaunch({
                url: '../../index',
              })
            },
              function (err) {
                console.log(err)
              });




          },
          error: function (object, error) {
            console.log('删除日记失败Delete Fail');
          }
        });
      },
      error: function (object, error) {
        console.log("query object fail");
      }
    });


    
    
  }
})