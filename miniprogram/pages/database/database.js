// pages/database/database.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  db: undefined, 
  users: undefined,

  data: {
    addName: 'initValue', addAge: '', 
    queryId: '', queryName: '', queryAge: '',
    updateId: '', updateName: '', updateAge: '',
    removeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid()
  },

  onGetOpenid: function () {
    var that = this
    // 调用login云函数获取openid
    wx.cloud.callFunction({
      name: 'login', 
      data: {}, 
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        
        // 数据库初始化
        wx.cloud.init({ env: 'test-415642' })
        that.db = wx.cloud.database()
        that.users = that.db.collection('users')
      }, 
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  /**
   * 插入数据
   */
  insertData: function () {
    var that = this
    try {     
      // 将年龄转换为整数类型值，如果输入的年龄不是数字，会显示错误对话框，并退出该函数
      var age = parseInt(that.data.addAge)     
      if (isNaN(age)) {        
        wx.showModal({
          title: '错误', content: '请输入正确的年龄', showCancel: false
        })        
        return
      }
     
      this.users.add({        
        data: {
          name: that.data.addName, age: age
        },       
        success: function (res) {
          console.log(res)
          wx.showModal({
            title: '成功', content: '成功插入记录', showCancel: false
          })
          that.setData({
            name: '', age: ''
          })
        }
      })
    } catch (e) {
      wx.showModal({
        title: '错误', content: e.message, showCancel: false
      })

    }
  }, 

  /**
   * 查询数据
   */
  queryData: function () {
    var that = this
    this.users.doc(this.data.queryId).get({      
      success: function (res) {
        // 判断是否为空
        if (res.data.name != null) {
          that.setData({
            queryName: res.data.name
          })
        }
        if (res.data.age != null){
          that.setData({
            queryAge: res.data.age
          })
        }
        // that.setData({
        //   queryName: res.data.name, queryAge: res.data.age
        // })
      },     
      fail: function (res) {
        wx.showModal({
          title: '错误', content: '没有找到记录', showCancel: false
        })
      }
    })
  }, 

  /**
   * 修改数据
   */
  updateData: function () {
    var that = this
    this.users.doc(this.data.updateId).update({     
     
      data: {
        name: that.data.updateName,
        age: that.data.updateAge
      },
     
      success: function (res) {  
        wx.showModal({
          title: '成功', content: '成功修改记录', showCancel: false
        })

      },     
      fail: function (res) {
        wx.showModal({
          title: '错误', content: '没有找到记录', showCancel: false
        })
      }
    })
  }, 

  /**
   * 删除数据
   */
  removeData: function () {
    var that = this
    this.users.doc(this.data.removeId).remove({      
      success: function (res) {
        wx.showModal({
          title: '成功', content: '成功删除记录', showCancel: false
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '错误', content: '没有找到记录', showCancel: false
        })
      }
    })
  }, 
  
  /**
   * 界面 ---> 变量
   */
  bindAddName: function (e) {
    this.setData({
      addName: e.detail.value
    })
  }, 
  bindAddAge: function (e) {
    this.setData({
      addAge: e.detail.value
    })
  }, 
  bindQueryId: function (e) {
    this.setData({
      queryId: e.detail.value
    })
  },

  bindUpdateId: function (e) {
    this.setData({
      updateId: e.detail.value
    })
  },
  bindUpdateName: function (e) {
    this.setData({
      updateName: e.detail.value
    })
  },
  bindUpdateAge: function (e) {
    this.setData({
      updateAge: e.detail.value
    })
  },
  
  bindRemoveId: function (e) {
    this.setData({
      removeId: e.detail.value
    })
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