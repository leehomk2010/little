// pages/myPage/myPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'mine',
    title: '在线抽奖',
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var a = getApp();
    let info = wx.getStorageSync("userInfo")
    if(info == null || info == ""){
      wx.getUserInfo({
        success(res) {
          that.setData({
            userInfo: res.userInfo
          })
          wx.setStorageSync("userInfo", res.userInfo)
        },fail(res){
          
        }
      })
    }else{
      that.setData({
        userInfo: info
      })
    }
    wx.hideTabBar({
      animation: false
    }),
      getApp().globalData.currTabFlag = "news",
      a.editTabBar()
    a.tabhead(that)
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

  }
})