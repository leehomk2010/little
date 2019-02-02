var requests = require('requests/request.js');
var siteInfo = require("siteinfo.js");
//app.js
App({
  editTabBar: function (e) {
    var t = this.globalData.tabbar, s = getCurrentPages(), n = s[s.length - 1], o = n.__route__;
    for (var a in 0 != o.indexOf("/") && (o = "/" + o), t.list) t.list[a].selected = !1,
      t.list[a].pagePath == o && (t.list[a].selected = !0);
    n.setData({
      tabbar: t
    });
  },
  tabhead: function (t) {
    wx.getSystemInfo({
      success: function (e) {
        -1 < e.model.indexOf("iPhone X") ? t.setData({
          headheight: 88
        }) : t.setData({
          headheight: 64
        });
      }
    });
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.hideTabBar({
    })
    var s = wx.getStorageSync("loginType") || "";
    "" === s ? wx.login({
      success: that.loginBack
    }) : wx.checkSession({
      success: function () { },
      fail: function () {
        wx.login({
          success: that.loginBack
        });
      }
    })
  },
  globalData: {
    userInfo: null,
    fansLoginUrl: siteInfo.siteroot+'wechat/login',
    siteInfo: require("siteinfo.js"),
    tabbar: {
      color: "#9F9494",
      selectedColor: "#F07575",
      backgroundColor: "#ffffff",
      borderStyle: "black",
      list: [{
        pagePath: "/pages/index/index",
        text: "主页",
        iconPath: "../../images/news.png",
        selectedIconPath: "../../images/newsOn.png",
        selected: !0
      }, {
        pagePath: "/pages/myPage/myPage",
        text: "我的",
        iconPath: "../../images/problem.png",
        selectedIconPath: "../../images/problemon.png",
        selected: !1
      }]
    }
  },
  loginBack:function(){
    var loginType = wx.getStorageSync('loginType');
    var o = getApp();
    if (loginType == null || loginType == undefined || loginType == '') {
      wx.login({
        success: function (res) {
          wx.setStorageSync('code', res.code);
          var jsonData = { code: res.code };
          requests.requestData(o.globalData.fansLoginUrl, jsonData, (data) => {
            if (data.flag) {
              wx.setStorageSync("loginType", data.loginType)
              wx.setStorageSync("loginId", data.loginId)
            }
          }, null, null);
        }
      })
    }
  }
  
})