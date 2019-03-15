//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    const isLogin = wx.getStorageSync('isLogin')
    const userinfo = wx.getStorageSync('user')

    console.log('isLogin==', isLogin);
    console.log('isLogin==', userinfo);
    if (isLogin !== '1' || !userinfo || !userinfo.id) {
      console.log('xixixi')
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/login',
          success(res) {
            console.log('rediret success===', res)
          },
          fail(err) {
            console.log('rediret fail====', err)
          }
        })
      }, 1000)
    }else{
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/wishList/wishList',
          // url: '/pages/bookList/bookList',
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          },
          complete: function (e) {
            console.log(e)
          }
        })
      }, 1000)
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code getUserInfo到后台换取 openId, sessionKey, unionId
        // 验证是否登录
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
          
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //   wx.getUserInfo({
        //     success: res => {
        //       // 可以将 res 发送给后台解码出 unionId
        //       this.globalData.userInfo = res.userInfo
        //       console.log(res.userInfo, 'userInfo')
        //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //       // 所以此处加入 callback 以防止这种情况
        //       if (this.userInfoReadyCallback) {
        //         this.userInfoReadyCallback(res)
        //       }
        //     }
        //   })
        // }
      }
    })

  },
})