// pages/lottery/lottery.js
var requests = require('../../requests/request.js');
var app = getApp();

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

function loadLottery(that, id, tId) {
  //判断是否已抽奖，并列出前5个抽奖人头像
  var jsonData = {
    pageSize: 6,
    lId: id,
    loginType: tId,
    more: 0
  };
  requests.requestData(that.data.fansListUrl, jsonData, (data) => {
    if (data.flag) {
      var mflag = true;
      if (data.total > 0) {
        mflag = false;
      }
      let tabchange = false;
      if(data.isLottery){
        tabchange = true;
      }
      that.setData({
        info: data,
        imgPath: data.imgUrl,
        fansList: data.list,
        total: data.total,
        isMore: mflag,
        imgList: data.imgList == null ? [] : data.imgList,
        copyright: data.copyright == null ? '' : data.copyright,
        title: data.title,
        lotteryFlag:data.isLottery,
        winnerFlag:data.winnerFlag,
        tabFlag: tabchange,
        winners:data.winners
      })
      if (data.lFlag) {
        that.setData({
          state: 2
        })
      }
      var xxpath = that.data.showPicUrl + data.imgUrl;
      wx.downloadFile({
        url: xxpath,
        success: (res) => {
          that.setData({
            scImg: res.tempFilePath,
          })
        },
      });
      wx.setStorageSync("info", data);
    }
  }, null, null);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    id: 0,
    title: "",
    status: false,
    lotteryText: "参与抽奖",
    fansLoginUrl: app.globalData.siteInfo.siteroot + "wechat/login",
    fansUpdateUrl: app.globalData.siteInfo.siteroot + "wechat/updateUserInfo",
    fansListUrl: app.globalData.siteInfo.siteroot + "front/lotteryFans",
    addRecordUrl: app.globalData.siteInfo.siteroot + "front/addLottery",
    showPicUrl: app.globalData.siteInfo.siteroot + "front/show_pic?fileUrl=",
    shareLayer: !0,
    info: {},
    state: 1,
    imgPath: "",
    fansList: [],
    addFlag: false,
    isMore: true,
    total: 0,
    imgList: [],
    copyright: '',
    imgUrl: "../../images/zjollog.jpg",
    screenWidth: 0,
    winHeight: 0,
    ratio: '',
    hiddenImg: true,
    nickName: '浙江在线',
    shareImgPath: "",
    scImg: "",
    pathRes: "",
    current: 'tab1',
    current_scroll: 'tab1',
    lotteryFlag:false,
    winnerFlag:true,
    tabFlag:false,
    winners:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a = this;
    var that = this;
    var id = options['id']
    var tId = wx.getStorageSync("loginType")
    var info = wx.getStorageSync("info");
    var userinfo = wx.getStorageSync("userInfo");
    if (tId == null || tId == '') {
      loginCheck(that);
      tId = wx.getStorageSync("loginType")
      loadLottery(that, id, tId);
    } else {
      loadLottery(that, id, tId);
    }
    if (userinfo == null || userinfo == '') {
      wx.getUserInfo({
        success(res) {
          that.setData({
            userInfo: res.userInfo
          })
          wx.setStorageSync("userInfo", res.userInfo)
        }
      })
    }
    wx.getSystemInfo({
      success: res => {
        that.setData({
          screenWidth: res.screenWidth,
          winHeight: res.windowHeight,
          ratio: res.pixelRatio
        })
      }
    })
    that.setData({
      id: id,
      info: info
    })
    //判断是否已抽奖，并列出前5个抽奖人头像

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
  onShareAppMessage: function (t) {
    var e = this, a = "";
    console.info(e.data.userInfo.nickName)
    a = e.data.userInfo.nickName + "给你发送了一个抽奖邀请,等你来抽";
    var o = getApp(), i = e.data.showPicUrl + e.data.imgPath;
    return console.log(i), {
      title: a,
      imageUrl: i,
      path: "/pages/lottery/lottery?id=" + e.data.id
    };
  },
  touchStart: function (t) {
    touchDot = t.touches[0].pageX;
  },
  touchMove: function (t) {
    var e = t.touches[0].pageX;
    touchend = e - touchDot;
  },
  touchEnd: function (t) {
    touchend < -100 && this.animation.translateX(-200).step(), 60 < touchend && this.animation.translateX(70).step()
  },
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      that.setData({
        userInfo: e.detail.userInfo
      })

      wx.setStorageSync("userInfo", e.detail.userInfo);
      var loginType = wx.getStorageSync("loginType");
      var jsonData = {
        loginType: loginType,
        encryptedData: e.detail.encryptedData,
        nickName:e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        country: e.detail.userInfo.country,
        gender: e.detail.userInfo.gender,
        city: e.detail.userInfo.city,
        province: e.detail.userInfo.province,
        iv: e.detail.iv
      };
      requests.requestData(that.data.fansUpdateUrl, jsonData, (data) => {
        if (data.flag) {
          //访问后台添加抽奖记录
          that.addReord();
          that.handleClick();
        }
      }, null, null);

    } else {
      //用户按了拒绝按钮
      console.info("***")
    }
  },
  handleChange({ detail }) {
    let that = this;
    let flag = that.data.tabFlag;
    this.setData({
      current: detail.key,
      tabFlag:!flag
    });
  },
  Invitation: function (t) {
    this.setData({
      shareLayer: !1
    });
  },

  participate: function (e) {
    var a = this;
    //后端添加抽奖记录
    a.setData({
      state: 2
    })
  },
  cancelLayer: function (t) {
    this.setData({
      shareLayer: !0
    });
  },
  handleClick: function (e) {
    var app = getApp();
    app.loginBack();
    this.setData({
      status: true,
      lotteryText: '等待开奖'
    });
  },
  addReord: function () {
    var that = this;
    var tId = wx.getStorageSync("loginType")
    var id = that.data.id;
    var jsonData = {
      loginType: tId,
      lId: id
    };
    requests.requestData(that.data.addRecordUrl, jsonData, (data) => {
      if (data.flag == 0) {
        //访问后台添加抽奖记录
        that.setData({
          addFlag: true,
          fansList: data.list,
          isMore: false,
          total: data.total
        })
      }
    }, null, null);
  },
  shareImg: function () {
    var e = this;
    var path = e.data.showPicUrl + e.data.imgPath;
    console.info(path)

    var that = this;
    //设置画板显示，才能开始绘图
    var unit = that.data.screenWidth / 375;
    var ratio = that.data.ratio;
    var screenWidth = that.data.screenWidth;
    var winHeight = that.data.winHeight;
    var bg = "../../images/bg2.jpg"
    var avatarUrl = that.data.imgUrl;
    var bgleavel = that.data.scImg;
    var qrcode = "../../images/zjolqrcode.jpg";
    var nickName = that.data.nickName;
    var context = wx.createCanvasContext('share');

    var wxappName = that.data.wxappName;
    // 绘制红色背景
    context.drawImage(bg, 0, 0, that.data.screenWidth, winHeight)
    // 绘制头像
    var avatarurl_width = unit * 45; //绘制的头像宽度
    var avatarurl_heigth = unit * 45; //绘制的头像高度
    var avatarurl_x = unit * 170; //绘制的头像在画布上的位置
    var avatarurl_y = unit * 15; //绘制的头像在画布上的位置

    context.save()
    context.restore(); //恢复之前保存的绘图上下文状态 还可以继续绘制.

    // 绘制昵称
    context.setFontSize(14)
    context.setFillStyle('#fff')
    context.setTextAlign('center')
    context.fillText(nickName, unit * 190, unit * 80)

    context.setFontSize(26)
    context.setFillStyle('#fff')
    context.setTextAlign("center")
    context.fillText("发起了一个抽奖活动", unit * 200, unit * 120)
    context.restore();
    context.rect(unit * 25, unit * 130, unit * 664 / 2, unit * 1000 / 2)
    context.setFillStyle('#fff')
    context.fill()
    context.restore();
    context.save();
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    context.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
    context.clip(); //画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
    context.drawImage(avatarUrl, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 将头像放到绘制好的圆中
    context.drawImage(bgleavel, unit * 40, unit * 135, unit * 600 / 2, unit * 307 / 2)
    context.setFontSize(20)
    context.setFillStyle('#000')
    context.setTextAlign("left")
    let content = that.data.title;
    let canvasWidth = 250; //画布宽度
    let canvasHeight = 60; //画布宽度
    let textareaWidth = Math.ceil(canvasWidth / 20); //画布宽度除以字号
    let text = [];//存放切割后的内容
    while (content.length > 0) {
      text.push(content.substr(0, textareaWidth))
      content = content.substr(textareaWidth, content.length)
    }

    for (let i = 0; i < text.length; i++) {
      let h = 0;
      switch (i) {
        case 0:
          h = unit * 310;
          break;
        case 1:
          h = unit * 330;
          break;
        case 2:
          h = unit * 360;
          break;
      }
      context.fillText(text[i], unit * 40, h)
    }
    context.restore();
    // 绘制第几位宣传者
    context.beginPath()
    context.setStrokeStyle("#E0E0E0")
    context.moveTo(unit * 40, unit * 360)
    context.lineTo(unit * 340, unit * 360)
    context.stroke()
    // 绘制二维码
    context.restore();
    context.drawImage(qrcode, unit * 138, unit * 370, unit * 204 / 2, unit * 204 / 2)
    context.restore();
    // 绘制二维码下部文字
    context.setFontSize(12)
    context.setFillStyle("#BBBBBB")
    context.setTextAlign("center")
    context.fillText("长按识别小程序，参与抽奖", unit * 187.5, unit * 490)

    context.setFontSize(12)
    context.setFillStyle("#BBBBBB")
    context.setTextAlign("left")
    let copyright = that.data.copyright;
    let canvasWidth2 = 300; //画布宽度
    let canvasHeight2 = 60; //画布宽度
    let textareaWidth2 = Math.ceil(canvasWidth2 / 12); //画布宽度除以字号
    let text2 = [];//存放切割后的内容
    while (copyright.length > 0) {
      text2.push(copyright.substr(0, textareaWidth2))
      copyright = copyright.substr(textareaWidth2, copyright.length)
    }
    for (let i = 0; i < text2.length; i++) {
      let h = 0;
      switch (i) {
        case 0:
          h = unit * 530;
          break;
        case 1:
          h = unit * 550;
          break;
        case 2:
          h = unit * 560;
          break;
      }
      console.info(text2[i])
      context.fillText(text2[i], unit * 40, h)
    }
    //把画板内容绘制成图片，并回调 画板图片路径
    context.restore();
    context.beginPath()
    context.setStrokeStyle("#E0E0E0")
    context.moveTo(unit * 40, unit * 510)
    context.lineTo(unit * 340, unit * 510)
    context.stroke()
    context.draw(false, function () {

      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: screenWidth,
        height: winHeight,
        destWidth: ratio * screenWidth,
        destHeight: ratio * winHeight,
        canvasId: 'share',
        quality: 1,
        success: function (res) {
          that.setData({
            shareImgPath: res.tempFilePath,
            hiddenImg: false,
            pathRes: res
          })

          var rrph = res.tempFilePath;
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          } else {
            wx.navigateTo({
              url: "../shareImg/shareImg?id=" + that.data.id + "&path=" + rrph + "&pathRes=" + JSON.stringify(res)
            });
          }
          wx.hideLoading()
        }
      })
    });


  },
  more: function (t) {
    wx.navigateTo({
      url: "../lotteryFans/lotteryFans?id=" + this.data.id
    });
  },
})