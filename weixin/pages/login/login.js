// pages/login/login.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: {
      name: '12345678901',
      pwd: '666666',
    },
    
    mode: 'login'
  },

  switchMode: function(_mode){
    this.setData({
      'account.name': '',
      'account.pwd': '',
      mode: _mode.target.dataset.mode || 'login'
    })
    console.log('hello===', this.data.account);
  },

  bindAccountInput: function (e) {
    this.setData({
      'account.name': e.detail.value
    })
  },
  bindPwdInput: function (e) {
    this.setData({
      'account.pwd': e.detail.value
    })
  },
  verify() {
    if (!this.data.account.name) {
      wx.showToast({
        title: '账号不能为空',
        icon: 'loading',
        duration: 1800
      })
      return false
    } else if (!this.data.account.pwd) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 1800
      })
      return false
    }
    return true
  },

  login() {
    console.log('in login.login===', this.data.account.name, this.data.account.pwd)
    const _this = this
    // loading
    wx.showLoading({
      title: 'loading',
    })
    if (this.verify()) {
      wx.request({
        url: 'http://barryli.ink:9999/user/v1/user/login',
        method: "POST",
        data: {
          username: _this.data.account.name,
          password: _this.data.account.pwd,
        },
        success(res) {
          console.log('login res====', res);
          wx.hideLoading()
          if (res.statusCode && res.statusCode === 200) {
            wx.setStorage({
              key: 'isLogin',
              data: '1',
            })
            wx.setStorage({
              key: 'user',
              data: res.data,
            })
            wx.switchTab({
              // url: '/pages/mine/mine',
              url: '/pages/bookList/bookList',
              success: function (e) {
                let page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              },
              complete: function (e) {
                console.log(e)
              }
            })
          } else if (res.statusCode && res.statusCode === 500){
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000//持续的时间

            })
          }
        },
        fail: function(){
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
          _this.setData({
            'account.name': '',
            'account.pwd': '',
          })
        }
      })
    }
  },

  regist() {
    const _this = this
    // loading
    wx.showLoading({
      title: 'loading',
    })
    if (this.verify()) {
      const _this = this
      // 请求注册
      wx.request({
        url: 'http://barryli.ink:9999/user/v1/user/add',
        method: "POST",
        data: {
          username: _this.data.account.name,
          password: _this.data.account.pwd,
          nickname: _this.data.account.name
        },
        success(res) {
          wx.hideLoading()
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          })
          console.log('regist res====', res);
          if (res.statusCode && res.statusCode === 200) {
            _this.setData({
              'account.name': '',
              'account.pwd': '',
              mode: 'login'
            })
          } else if (res.statusCode && res.statusCode === 500) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000//持续的时间

            })
          }
        },
        complete() {
          wx.hideLoading()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('in login onload=====', options)
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