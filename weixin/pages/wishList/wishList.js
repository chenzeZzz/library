// pages/bookList/bookList.js
const date = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    activeIndex: '1',
    searchKey: '',
    bookList: [],
    orderList: [],
    currBookType: '点击选择类型',
    user: ''
  },
  onLoad() {
    wx.setEnableDebug({
      enableDebug: true
    })
    this.setData({
      user: wx.getStorageSync('user')
    })
  },
  onShow() {
    this.setData({
      searchKey: '水浒传'
    })
  },

  switchTab(event) {
    const index = event.target.dataset.index
    this.setData({ activeIndex: index })
    // if (index === '1') this.getBookList()
    if (index === '2') this.getOrderList()
  },

  bindKeyInput(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  resetTitle$List() {
    this.setData({
      searchKey: ''
    })
    this.getBookList()
  },

  search() {
    wx.showLoading({
      title: 'loading',
    })
    const _this = this
    if (!_this.data.searchKey) {
      return
    }
    console.log('===', 'https://api.douban.com/api/v2/book/search?q=' + _this.data.searchKey)
    wx.request({
      // url: 'https://api.douban.com/v2/book/search?q=' + _this.data.searchKey,
      url: 'https://47.99.165.165/v2/book/search?q=' + _this.data.searchKey,
      method: 'GET',
      header: {
        'Content-Type': 'application/xml'
      },
      success(res) {
        wx.hideLoading()
        console.log('getBookList res====', res);
        if (res.statusCode && res.statusCode === 200) {
          const data = res.data.books
          if (data) {
            data.forEach(item => {
              console.log('item==', item)
              item.title = item.title
              item.press = item.publisher
              item.author = item.author.join(',')
            })
            _this.setData({
              bookList: data,
            })
          }
          else {
            _this.setData({
              bookList: []
            })
          }
        } else {
          if (res.statusCode && res.statusCode === 500) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000//持续的时间
            })
          }
          _this.setData({
            bookList: []
          })
        }
      },
    })
  },

  getOrderList() {
    const _this = this
    wx.request({
      url: 'http://barryli.ink:9999/book/v1/bookWishRank',
      method: 'GET',
      data: {
        userId: this.data.user.id,
      },
      success(res) {
        console.log('getBookRank res====', res);  
        if (res.statusCode && res.statusCode === 200) {
          if (res.data) {
            const data = res.data
            _this.setData({
              orderList: data
            })
          }
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

  star(data) {
    let _url = ''
    let _bookId = ''
    let collected = true
    if (data && data.currentTarget && data.currentTarget.dataset) {
      collected = data.currentTarget.dataset.collected
      _bookId = data.currentTarget.dataset.bookid
      if (collected === true) {
        _url = 'http://barryli.ink:9999/book/v1/bookRack/collection/cancel'
      } else {
        _url = 'http://barryli.ink:9999/book/v1/bookRack/collect'
      }
    } else {
      return
    }
    const _this = this
    wx.request({
      url: _url,
      method: 'POST',
      data: {
        userId: Number(_this.data.user.id),
        bookId: Number(_bookId)
      },
      success(res) {
        if (res.statusCode && res.statusCode === 200) {
          if (_this.data.activeIndex === '1') {
            const tmp = _this.data.bookList.filter((item) => {
              if (item.id === _bookId) {
                item.collected = !item.collected
              }
              return item
            })
            _this.setData({
              bookList: tmp
            })
          } else {
            const tmp = _this.data.orderList.filter((item) => {
              if (item.id === _bookId) {
                item.collected = !item.collected
              }
              return item
            })
            _this.setData({
              orderList: tmp
            })
          }

          wx.showToast({
            title: collected ? '取消收藏' : '收藏成功',
            icon: 'success',
            duration: 2000
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

  addWish(data) {
    const _this = this
    let _bookTitle = ''
    let _bookAuthor = ''
    if (data && data.currentTarget && data.currentTarget.dataset) {
      _bookTitle = data.currentTarget.dataset.title
      _bookAuthor = data.currentTarget.dataset.author
    }else{
      return wx.showToast({
        title: '该书未开放',
        icon: 'none',
        duration: 1000//持续的时间
      })
    }
    wx.request({
      url: 'http://barryli.ink:9999/book/v1/bookWish/add',
      method: 'POST',
      data: {
        userId: Number(_this.data.user.id),
        bookTitle: _bookTitle,
        bookAuthor: _this.data.searchKey,
      },
      success(res) {
        if (res.statusCode && res.statusCode === 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
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

})