// pages/lotteryFans/lotteryFans.js
var requests = require('../../requests/request.js');
var app = getApp();
function imlist(a) {
  var loginType= wx.getStorageSync("loginType")
  var t={}
  t.pageNum =  a.data.p;
  t.pageSize = a.data.pageSize;
  t.lId = a.data.id;
  t.loginType = loginType
  t.more=a.data.more
  requests.requestData(a.data.fanslisturl, t, (data) => {
    if (data.flag) {
      //访问后台添加抽奖记录
      var pageData = [];
      pageData = a.data.usercodelist;
      pageData = pageData.concat(data.list);
      var pi = a.data.p+1;
      a.setData({
        usercodelist:pageData,
        p:pi,
        total:data.total,
        isLast:data.isLast
      })
    }
  }, null, null); 
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    p:0,
    usercodelist:[],
    pageSize :50,
    fanslisturl:app.globalData.siteInfo.siteroot+"/front/lotteryFans",
    total:0,
    more:0,
    isLast:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    that.setData({
      id: id
    })
    imlist(that);
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
  more:function(){
    var that = this;
    that.setData({
      more:1
    })
    imlist(that);
  }
})