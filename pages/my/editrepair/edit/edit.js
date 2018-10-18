// pages/my/editrepair/edit/edit.js
var Bmob = require('../../../../utils/bmob.js');
var common = require('../../../../utils/common.js');
var name, tel;
var objectid;
var that;
var repair = Bmob.Object.extend("repair");
var query = new Bmob.Query(repair);
Page({

  data: {
    name: "",
    data: ""
  },

 
  onLoad: function (options) {
    objectid = options.objectid;
name=options.name;
tel=options.tel;
    that = this;
that.setData({
  name:name,
  tel:tel
})
    console.log(objectid)

  },

 
  formSubmit: function (e) {
  
    var newname = e.detail.value.name;
    var newtel = e.detail.value.tel;


   
    query.get(objectid, {
      success: function (result) {
    
     //update repair person info
        result.set('name', newname);
        result.set('tel', newtel);
        result.save();
        console.log("name" + name + "tel" + tel)

        
        wx.navigateBack({
          delta: 1
        })

        // The object was retrieved successfully.
      },
      error: function (object, error) {

      }
    });


  }
})