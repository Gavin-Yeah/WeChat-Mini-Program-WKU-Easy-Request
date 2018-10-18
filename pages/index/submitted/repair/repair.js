// pages/board/submitted/repair/repair.js
var Bmob = require('../../../../utils/bmob.js');
var common = require('../../../../utils/common.js');
var array= [];
var objectarray= [];
var index;
var tel=[];
var obj=[];
var objectid;
var managerid,managername,managertel,manager;
var userid, facilitytype, facilitylocation,repairtel,repairname;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    objectArray: [ ],
    index:0
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    objectid = options.objectid;
    wx.getStorage({
      key: 'objectid',
      success: function (res) {
        managerid = res.data
        console.log(res.data)
      }
    })

    var Manager = Bmob.Object.extend("user");
    var query = new Bmob.Query(Manager);
    query.get(managerid, {
      success: function (result) {
        // The object was retrieved successfully.
         manager=result;
        managername = result.get("name");
        managertel = result.get("tel");
        console.log(managerid);
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
    var that = this;
    
    var repair = Bmob.Object.extend("repair");
    var query = new Bmob.Query(repair);
    query.find({
      success: function (results) {

        for (var i = 0; i < results.length; i++) {
          array[i]=(results[i].get('name'));
          tel[i] = (results[i].get('tel'));
          obj[i]=results[i];

          var data = { "id": i, "name": results[i].get('name') };
          objectarray[i]=data;
        }

        console.log(array);
        console.log(objectarray);

        that.setData({
          array: array,
          objectArray: objectarray
        })
      }

    })
  },
  formSubmit:function(e){
    var Request = Bmob.Object.extend("request");
    var query = new Bmob.Query(Request);
    query.include("user");
    query.include("repair");

    // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
    query.get(objectid, {
      success: function (database) {
        facilitytype = database.get("facilitytype");
        facilitylocation = database.get("facilitylocation");
        userid = database.get("user").openid;
        repairtel = tel[e.detail.value.repair];
        repairname = array[e.detail.value.repair];
        console.log("repair:" + obj[e.detail.value.repair])
        var pointer = obj[e.detail.value.repair];
        
         console.log("repairman:" + pointer)
        database.set('repair', pointer);
        database.set('manager', manager);
        database.set('state', 1);
        var date = new Date();
        console.log(date) 
   
        database.set('accept', date);

        database.save();
        // The object was retrieved successfully.
     wx.showModal({
      title: 'Tip',
      content: '成功Sucess',
      showCancel: false,
      confirmText: "OK",
      confirmColor: "#007AFF",
      success: function (res) {
        if (res.confirm) {
        
         
         
         console.log("form" + e.detail.formId)
         var temp = {
           "touser": userid,
           "template_id": "zChD7j1EDKNSVAMMLMXkMURH0ph7u748U92G_8TDZnQ",
           "page": "",
           "form_id": e.detail.formId,
           "data": {
             "keyword1": {
               "value": facilitytype+" (在)at "+facilitylocation
             },
             "keyword2": {
               "value": "Manager: "+managername
             },
             "keyword3": {
               "value": "Manager Tel: "+managertel
             },
             "keyword4": {
               "value": "RepairPerson: " + repairname
             },
             "keyword5": {
               "value": "RepairPerson Tel: " + repairtel
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
           url: '../../index',
         })
         
         
         
         
         }
        
      }
    })
        // The object was retrieved successfully.
 },
      error: function (object, error) {
        wx.showModal({
          title: 'Tip',
          content: '失败Fail',
          showCancel: false,
          confirmText: "OK",
          confirmColor: "#007AFF",
          success: function (res) {

          }
        })
      }
    });
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
})