// pages/index/index.js
var requests = require('../../requests/request.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listUrl: app.globalData.siteInfo.siteroot+'front/lotteryList',
    fansLoginUrl: app.globalData.siteInfo.siteroot+"wechat/login",
    showPicUrl: app.globalData.siteInfo.siteroot+"front/show_pic?fileUrl=",
    formUrl: app.globalData.siteInfo.siteroot+"front/addForm",
    current: 'homepage',
    title:'在线抽奖',
    lotteryList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var a = getApp();
    wx.hideTabBar({
      animation: false
    })
    var loginType = wx.getStorageSync('loginType');
    if (loginType == null || loginType == undefined || loginType == '') {
      wx.login({
        success: function (res) {
          wx.setStorageSync('code', res.code);
          var jsonData = { code: res.code };
          requests.requestData(that.data.fansLoginUrl, jsonData, (data) => {
            if (data.flag) {
              wx.setStorageSync("loginType", data.loginType)
              wx.setStorageSync("loginId", data.loginId)
            }
          }, null, null);
        }
      })
    }
    var list = wx.getStorageSync("lotteryList")
    if (list != null){
      that.setData({
        lotteryList:list
      })
    } 
    a.editTabBar()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getInitList();
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
  handleChange({ detail }) {
    
    if (detail.key =='homepage'){
      wx.switchTab({
        url: '../index/index',
      })
    } else if (detail.key == 'mine'){
      wx.switchTab({
        url: '../myPage/myPage',
      })
    }
  },
  linkFans:function(event){
    var that = this;
    var loginType = wx.getStorageSync('loginType');
    var t_data = { formId: event.detail.formId,loginType:loginType};
    requests.requestData(that.data.formUrl, t_data, (data) => {
    }, null, null);
    wx.navigateTo({
      url: '../lottery/lottery?id=' + event.detail.value.id,
    })
  },

  getInitList:function(){
    var that = this;
    var t_data = {};
    requests.requestData(that.data.listUrl, t_data, (data) => {
      that.setData({
        lotteryList: data.list
      })
      wx.setStorageSync("lotteryList", data.list)
    }, null, null);
  }



})