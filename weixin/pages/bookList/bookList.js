// pages/bookList/bookList.js
const date = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    activeIndex: '1',
    searchKey: '',
    bookAuthor: '',
    bookCode: '',
    bookList: [],
    orderList: [],
    pageindex: 1,
    hasnextpage: false,
    bookType: [],
    currBookTypeId: '',
    currBookType: '点击选择类型',
    user: ''
  },
  onLoad() {
    wx.setEnableDebug({
        enableDebug: true
    })
    this.setData({
      searchKey: '',
      bookCode: '',
      bookAuthor: '',
      user: wx.getStorageSync('user')
    })
  },
  onShow() {
    this.getBookList()
    this.getBookType()
    this.setData({
        searchKey: ''
    })
    this.setData({
      bookCode: ''
    })
    this.setData({
      bookAuthor: ''
    })
  },

  switchTab(event) {
    const index = event.target.dataset.index
    console.log('index===', index)
    this.setData({ activeIndex: index })
    if (index === '1') this.getBookList()
    if (index === '2') this.getOrderList()
  },

  bindKeyInput(e) {
      this.setData({
          searchKey: e.detail.value
      })
  },
  searchBookAuthorInput(e) {
    this.setData({
      bookAuthor: e.detail.value
    })
  },
  searchBookCodeInput(e) {
    this.setData({
      bookCode: e.detail.value
    })
  },

  search() {
    if (!this.data.searchKey || !this.data.bookCode || !this.data.bookAuthor) {
        this.getBookList()
        return
      }
      const _this = this
      wx.showLoading({
          title: 'loading',
      })
      wx.request({
        url: 'http://barryli.ink:9999/book/v1/book/search',
        method: 'POST',
        data: {
            bookTitle: _this.data.searchKey,
            bookCode: _this.data.bookCode,
            bookAuthor: _this.data.bookAuthor
        },
        success(res) {
          if (res.statusCode && res.statusCode === 200) {
            const data = res.data.result
            if(data){
              data.forEach(item => {
                item.record_date = date.formatTime(item.record_date).substring(0, 10)
                var array = wx.base64ToArrayBuffer(item.bookImage);
                var base64 = wx.arrayBufferToBase64(array);
                //将转后的信息赋值给image的src 
                item.image = "data:image/png;base64," + item.bookImage
              })
              _this.setData({
                  bookList: data || []
              })
            } else {
              _this.setData({
                bookList: []
              })
            }
          }else{
              if(res.statusCode && res.statusCode === 500){
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
        complete() {
            wx.hideLoading()
        }
    })
    console.log(this.data.searchKey)
  },

  resetTitle$List() {
    this.setData({
        searchKey: ''
    })
    this.getBookList()
  },

  resetCode$List() {
    this.setData({
      bookCode: ''
    })
    this.getBookList()
  },

  resetAuthor$List() {
    this.setData({
      bookAuthor: ''
    })
    this.getBookList()
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
        console.log(res);
      }
    })
    // wx.navigateTo({
    //   url: `/pages/bookPdf/bookPdf?id=${id}&title=${title}`
    // })
  },

  getBookList(_pageNum, refresh = true) {
    wx.showLoading({
        title: 'loading',
    })
    const _this = this
    let _data = {
      userId: this.data.user.id,
      pageNum: _pageNum || 1,
      bookType: this.data.currBookTypeId || '',
    }
    if (_this.data.searchKey){
      _data.bookTitle = _this.data.searchKey
    }
    if (_this.data.bookCode) {
      _data.bookCode = _this.data.bookCode
    }
    if (_this.data.bookAuthor) {
      _data.bookAuthor = _this.data.bookAuthor
    }
    wx.request({
      url: 'http://barryli.ink:9999/book/v1/book/search',
      method: 'POST',
      data: _data,
      success(res) {
        wx.hideLoading()
        console.log('getBookList res====', res);              
        if (res.statusCode && res.statusCode === 200) {
          const data = res.data.result
          if(data){
            data.forEach(item => {
                item.record_date = date.formatTime(item.record_date).substring(0, 10)
                var array = wx.base64ToArrayBuffer(item.bookImage);
                var base64 = wx.arrayBufferToBase64(array);
                 //将转后的信息赋值给image的src 
                item.image = "data:image/png;base64," + item.bookImage
            })
            _this.setData({
              bookList: refresh ? data : _this.data.bookList.concat(data),
              pageindex: res.data.pageNum,
              hasnextpage: res.data.pageNum < res.data.totalPages
            })
          }
          else {
            _this.setData({
              bookList: []
            })
          }
        }else{
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

  getBookType() {
    wx.showLoading({
      title: 'loading',
    })
    const _this = this
    wx.request({
      url: 'http://barryli.ink:9999/book/v1/bookType/all',
      method: 'GET',
      data: {
        // pageNum: _pageNum || 1
      },
      success(res) {
        wx.hideLoading()
        // console.log('getBookType res====', res);
        if (res.statusCode && res.statusCode === 200) {
          const data = res.data
          const typeArray = [];
          data.unshift({id: 0, name: '所有'})
          _this.setData({
            bookType: data,
          })
        } else if (res.statusCode && res.statusCode === 500) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      },
    })
  },

  bindPickerChange(data){
    if (data && data.detail && data.detail.value){
      if (data.detail.value === '0') {
        this.setData({
          currBookTypeId: '',
          currBookType: '点击选择类型',
        })
      }else{
        const currBookTypeObj = this.data.bookType[data.detail.value]
        console.log(currBookTypeObj)
        this.setData({
          currBookTypeId: currBookTypeObj.id,
          currBookType: currBookTypeObj.name,
        })
      }
      this.getBookList(1)
    }
  },
    
  getOrderList() {
    const _this = this
    wx.request({
      url: 'http://barryli.ink:9999/book/v1/bookRank',
      method: 'GET',
      data: {
        userId: this.data.user.id,
      },
      success(res) {
        // console.log('getBookRank res====', res);  
        if (res.statusCode && res.statusCode === 200){
          if (res.data) {
            const data = res.data
            data.forEach(item => {
              //将转后的信息赋值给image的src 
              item.image = "data:image/png;base64," + item.book.bookImage
              item.id = item.book.id
              item.title = item.book.title
              item.author = item.book.author
              item.collected = item.book.collected
            })
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

  star(data){
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
    }else{
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
        if (res.statusCode && res.statusCode === 200){
          if (_this.data.activeIndex === '1'){
            const tmp = _this.data.bookList.filter((item) => {
              if (item.id === _bookId) {
                item.collected = !item.collected
              }
              return item
            })
            _this.setData({
              bookList: tmp
            })
          }else{
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
            title: collected ? '取消收藏' :'收藏成功',
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

  addWish() {
      const _this = this
      const user = wx.getStorageSync('user')
      wx.request({
          url: 'http://localhost:8888/wish/add',
          method: 'POST',
          data: {
              title: _this.data.searchKey,
              user: user
          },
          success(res) {
            if (res.statusCode && res.statusCode === 200){
              wx.showToast({
                  title: res.data.msg,
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

  nextpage: function () {
    if (this.data.hasnextpage) {
      //显示加载中
      wx.showToast({
        title: '加载中...',
        duration: 100,
        icon: 'loading',
      });
      var newPageIndex = this.data.pageindex + 1;
      this.getBookList(newPageIndex, false);
    }
    else {
      wx.showToast({
        title: '下面没有数据了',
        icon: 'info',
        duration: 2000
      })
    }
  },
})