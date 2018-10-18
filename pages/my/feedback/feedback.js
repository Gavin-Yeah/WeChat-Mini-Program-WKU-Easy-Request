var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp()
var currentuser,userid;
Page({
    data: {
        userInfo: {},
        counter:0
    },
    onLoad: function () {
        var that = this
        app.getUserInfo(function (userInfo) {
            console.log(userInfo)
            that.setData({
                userInfo: userInfo
            })
        })

    }, 
    bindinput:function(event){
      var that= this;
      that.setData({
        counter: event.detail.value.length
      })
   },
    addFeedback: function (event) {
        var that = this;
        var content = event.detail.value.content;
      
        
        if (!content) {
            common.showTip("内容不能为空 No Content", "loading");
            return false;
        }
        else {
            that.setData({
                loading: true
            })
            //增加日记


            wx.getStorage({
              key: 'objectid',
              success: function (res) {
                userid = res.data
                console.log(res.data)
              }
            })

            var User = Bmob.Object.extend("user");
            var query1 = new Bmob.Query(User);
            query1.get(userid, {
              success: function (result) {
                // The object was retrieved successfully.
               currentuser=result;
               console.log("current user is query" + currentuser)
                console.log("userid is: "+userid);
                console.log("user name is: " +result.get("name"))



                var Feedback = Bmob.Object.extend("feedback");
                var feedback = new Feedback();
                console.log("current user" + currentuser)
                feedback.set("user", currentuser)
                feedback.set("content", content);

                //添加数据，第一个入口参数是null
                feedback.save(null, {
                  success: function (result) {
                 
                    common.showModal('保存反馈成功 Success', 'Tip', function () {
                      wx.navigateBack();
                    });

                    // wx.navigateBack();
                    that.setData({
                      loading: false
                    })

                  },
                  error: function (result, error) {
                    // 添加失败
                    common.showModal('反馈失败 Fail');

                  }
                });







              },
              error: function (result, error) {
                console.log("查询失败");
              }
            });




        }

    },

})