// pages/history/history.js
var requests = require('../../requests/request.js');
var app = getApp();
function myPart(that, tId,isLottery) {
  var jsonData = {
    loginType: tId
  };
  if (isLottery != null){
    jsonData.loginType = tId
  }
  requests.requestData(that.data.doList, jsonData, (data) => {
    if (data.flag) {
      that.setData({
        lucklist: data.list,
        noData: data.noData
      });
    }
  }, null, null);
  
}

function loginCheck(that) {
  wx.login({
    success: function (res) {
      wx.setStorageSync('code', res.code);
      var jsonData = { code: res.code };
      requests.requestData(that.data.fansLoginUrl, jsonData, (data) => {
        if (data.flag) {
          wx.setStorageSync("loginType", data.loginType)
        }
      }, null, null);
    }
  })
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    fansId:0,
    navOn: 1,
    lucklist:[],
    doList: app.globalData.siteInfo.siteroot + 'front/isLotteryList',
    fansLoginUrl: app.globalData.siteInfo.siteroot + "wechat/login",
    showPicUrl: app.globalData.siteInfo.siteroot + "front/show_pic?fileUrl=",
    noData:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tId = wx.getStorageSync("loginType")
    console.info("3333"+tId)
    if (tId == null || tId == '') {
      loginCheck(that);
      tId = wx.getStorageSync("loginType")
    } 
    myPart(that, tId, 1);
    that.setData({
        fansId:tId
      })
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
  navSwitch: function (t) {
    var a = this, e = t.currentTarget.dataset.id;
    if(a.data.navOn != e){
      a.setData({
        navOn:e
      })
      
    }
    let isLottery = 1
    if (e != 1) {
      isLottery = null
    }
    myPart(a, a.data.fansId, isLottery)
  },
  detail: function (t) {
    var a = t.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lottery/lottery?id=' + a
    });
  }
})