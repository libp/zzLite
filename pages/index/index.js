var WxParse = require('../../wxParse/wxParse.js');
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    title: '',
    author: '',
    content: '加载中...'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (res) {
    var that = this; 
    var value = wx.getStorageSync('not_prompt_load');
    if (!value) {
      that.showModal();
    };
    if(res.id){
      that.getContentByID(res.id, that);
    }else{
      wx.request({
        url: 'https://www.nichuiniu.cn/v1/recommend',
        header: {
          'content-type': 'application/json',
          'dataType': 'json'
        },
        success: function (res) {
          WxParse.wxParse('content', 'html', res.data.content, that),
            that.setData({
              title: res.data.title,
              author: res.data.author,
            }),
            that.setContentStorage(res)
        }
      })
    }
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: 'https://www.nichuiniu.cn/v1/random', 
      method: "GET",
      header: {
        'content-type': 'application/text',
        'dataType': 'json'
      },
      success: function (res) {
        WxParse.wxParse('content', 'html', res.data.content, that),
        that.setData({
          title: res.data.title,
          author: res.data.author,
        }),
        wx.hideNavigationBarLoading();
        // 停止下拉动作  
        wx.stopPullDownRefresh();
        that.setContentStorage(res);
      }
    })
  },
  showModal: function () {
    wx.showModal({
      content: '下拉刷新，随机阅读',
      showCancel: false,
      confirmText: '知道了',
      success: function (res) {
        if (res.confirm) {
          wx.setStorage({
            key: "not_prompt_load",
            data: "true",
          })
        }
      }
    })
  },
  setContentStorage: function (res){
    wx.setStorage({
      key: "title",
      data: res.data.title,
      key: "author",
      data: res.data.author,
      key: "id",
      data: res.data.id,
    })
  },
  getContentByID: function (id,that){
    wx.request({
      url: 'https://www.nichuiniu.cn/v1/articleID?id=' + id,
      header: {
        'content-type': 'application/json',
        'dataType': 'json'
      },
      success: function (res) {
        WxParse.wxParse('content', 'html', res.data.content, that),
          that.setData({
            title: res.data.title,
            author: res.data.author,
          }),
          that.setContentStorage(res)
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync('title'),
      path: '/pages/index/index' + '?id=' + wx.getStorageSync('id'),
    }
  }
  
})
