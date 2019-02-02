function actDetail(o) {
   
}

Page({
  data: {
    headtxt: "生成分享图",
    imgUrl:"../../images/zjollog.jpg",
    screenWidth:0,
    winHeight:0,
    ratio:'',
    wxappName: "来试试你的运气",
    hiddenImg: true,
    nickName:'浙江在线',
    shareImgPath:"",
    scImg:"",
    pathRes:"",
    openSettingBtnHidden:true,
    saveImgBtnHidden:false

  },
  onLoad: function (o) {
    var t = this;
    //读取缓存，获取微信头像和昵称
    //获取用户设备信息，屏幕宽度
    console.info(o.path+"222")
    t.setData({
      shareImgPath:o.path,
      pathRes: o.pathRes
    })
    getApp().tabhead(t), o.id && (t.data.id = o.id);
  },
  onReady: function () {
    },
  onShow: function () {
    },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },
  prese: function (o) {
    var that = this;
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//这里是用户同意授权后的回调
              that.savaImageToPhoto();
            },
            fail() {//这里是用户拒绝授权后的回调
              that.setData({
                saveImgBtnHidden: true,
                openSettingBtnHidden: false
              })
            }
          })
        } else {//用户已经授权过了
          that.savaImageToPhoto();
        }
      }
    })
  },
  savaImageToPhoto:function(e){
    let that = this;
    var temp = JSON.parse(that.data.pathRes);
    wx.showLoading({
      title: "保存中",
      mask: !0
    }),
      wx.saveImageToPhotosAlbum({

        filePath: temp.tempFilePath,
        //保存成功失败之后，都要隐藏画板，否则影响界面显示。
        success: (res) => {
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1500,
            mask: false,
            success: function () {

            }
          });
        },
        fail: (res) => {
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1500,
            mask: false,
            success: function () {

            }
          });
        }
      })
  },
  handleSetting: function (e) {
    let that = this;
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
      that.setData({
        saveImgBtnHidden: true,
        openSettingBtnHidden: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      that.setData({
        saveImgBtnHidden: false,
        openSettingBtnHidden: true
      })
    }
  }
  
});