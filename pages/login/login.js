//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   
  },

  //事件处理函数

 onShow(){
  
 },
 button:function(){
   wx.reLaunch({
     url: '/pages/my/my',
   })
 }
})