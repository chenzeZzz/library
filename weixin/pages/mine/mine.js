// pages/mine/mine.js
const date = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        user: '',
        userInfo: {},
        hasUserInfo: false,
        showHistory: true,
        showWishes: false,
        records: [],
        wishes: []
    },

    onLoad() {
      this.setData({
          user: wx.getStorageSync('user')
      })
      console.log('user==', wx.getStorageSync('user'));
    },
    onShow() {
        this.getUserInfo()
        this.getRecords()
        // this.getWishes()
    },
    getUserInfo() {
      const userinfo = wx.getStorageSync('user')
      console.log('userinfo====', userinfo);
      if (userinfo) {
        this.setData({
          userInfo: userinfo,
        })
      } else {
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
      }
    },

    getRecords() {
      const _this = this
      wx.request({
        url: 'http://barryli.ink:9999/book/v1/bookRack',
          data: {
              userId: Number(this.data.user.id),
          },
          success(res) {
            console.log('get Records===', res);
            if (res.statusCode && res.statusCode === 200) {
              const data = res.data
              data.forEach(item => {
                //将转后的信息赋值给image的src 
                item.image = "data:image/png;base64," + item.book.bookImage
                item.id = item.book.id
                item.title = item.book.title
                item.author = item.book.author
                item.collected = item.book.collected
              })
              console.log(data);

              _this.setData({
                records: data || []
              })
            } else if (res.statusCode && res.statusCode === 500) {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000//持续的时间
              })
            }      
          }
      })
    },

  toBookDetail(item) {
    const id = item.currentTarget.dataset.id
    const title = item.currentTarget.dataset.title
    wx.showLoading({
      title: 'loading',
    })
    wx.downloadFile({
      url: 'http://barryli.ink:9999/book/v1/book/download?bookId=' + id + '&userId=' + this.data.user.id,
      success: function (res) {
        var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          fileType: 'pdf',
          success: function (res) {
            wx.hideLoading()
            console.log('打开成功');
          },
          fail: function (res) {
            wx.hideLoading()
            console.log(res);
          }
        })
      },
      fail: function (res) {
        wx.hideLoading()
        console.log(res);
      }
    })
    // wx.hideLoading()
  },

    getWishes() {
      const _this = this
      wx.request({
          url: 'http://localhost:8888/wish/mine',
          data: {
              user: _this.data.user
          },
          success(res) {
              if (res.data.result) {
                  _this.setData({
                      wishes: res.data.data
                  })
              }
          }
      })
    },

    returnBack(option) {
      const { title, user, image } = option.currentTarget.dataset.detail
      const _this = this
      wx.request({
          url: 'http://localhost:8888/record/add',
          method: 'POST',
          data: {
              title,
              image,
              user: app.globalData.user,
              status: 2
          },
          success(res) {
              if (res.data.result) {
                  wx.showToast({
                      title: '还书成功',
                  })
                  _this.getRecords()
              } else {
                  wx.showToast({
                      title: `还书失败:${res.data.msg}`,
                  })
              }
          }
      })
    },

    toggleShowHistory() {
      console.log('======', this.data.records)
        this.setData({
            showHistory: !this.data.showHistory
        })
    },
    toggleShowWishes() {
        this.setData({
            showWishes: !this.data.showWishes
        })
    },
    cancelWish(option) {
      const { id, user } = option.currentTarget.dataset.detail
      const _this = this
      wx.request({
        url: 'http://barryli.ink:9999/book/v1/bookRack/collection/cancel',
        method: 'POST',
        data: {
          userId: Number(_this.data.user.id),
          bookId: Number(id)
        },
        success(res) {
          if (res.statusCode && res.statusCode === 200) {
            wx.showToast({
                title: '移除成功',
            })
            _this.getRecords()
          } else {
              wx.showToast({
                title: `移除失败:${res.data.msg}`,
              })
          }
        }
      })
    }
})
