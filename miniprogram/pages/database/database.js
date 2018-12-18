// pages/database/database.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  db: undefined, 
  users: undefined,

  data: {
    name: '', age: '', recordId: '', nameResult: '', ageResult: '',
    updateRecordId: '', updateName: '', updateAge: '',
    removeRecordId: ''
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

  // 插入数据
  insertData: function () {
    var that = this
    try {     //  将年龄转换为整数类型值
      var age = parseInt(that.data.age)     //  如果输入的年龄不是数字，会显示错误对话框，并退出该函数
      if (isNaN(age)) {        //  显示错误对话框
        wx.showModal({
          title: '错误', content: '请输入正确的年龄', showCancel: false
        })        
        return
      }
      //  向test数据集添加记录
      this.users.add({        // data 字段表示需新增的 JSON 数据
        data: {
          name: that.data.name, age: age
        },        //  数据插入成功，调用该函数
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
  // 查询数据
  queryData: function () {
    var that = this
    //  根据记录ID搜索数据集  
    this.users.doc(this.data.recordId).get({      // 找到记录集调用
      success: function (res) {
        //  将查询结果显示在页面上  
        that.setData({
          nameResult: res.data.name, ageResult: res.data.age
        })

      },     //  未查到数据时调用
      fail: function (res) {
        wx.showModal({
          title: '错误', content: '没有找到记录', showCancel: false
        })
      }
    })

  }, 

  // 修改数据
  updateData: function () {
    var that = this

    var name = that.data.updateName
    var age = that.data.updateAge
    //  根据记录ID搜索数据集  
    this.users.doc(this.data.updateRecordId).update({      // 找到记录集调用
     
      data: {
        name: that.data.updateName,
        age: that.data.updateAge
      },
     
      success: function (res) {
        //  将查询结果显示在页面上  
        that.setData({
          nameResult: res.data.name, ageResult: res.data.age
        })

      },     
      fail: function (res) {
        wx.showModal({
          title: '错误', content: '没有找到记录', showCancel: false
        })
      }
    })

  }, 

  // 删除数据
  removeData: function () {
    var that = this

    //  根据记录ID搜索数据集  
    this.users.doc(this.data.removeRecordId).remove({      // 找到记录集调用
      success: function (res) {
        console.log(res)
        that.getUserMsg()
      },
      fail: function (res) {
        wx.showModal({
          title: '错误', content: '没有找到记录', showCancel: false
        })
      }
    })

  }, 
  
  //  下面的函数用于当更新input组件中的值时同时更新对应变量的值
  bindKeyInputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  }, 
  bindKeyInputAge: function (e) {
    this.setData({
      age: e.detail.value
    })
  }, 
  bindKeyInputId: function (e) {
    this.setData({
      recordId: e.detail.value
    })
  },

  bindKeyUpdateName: function (e) {
    this.setData({
      updateName: e.detail.value
    })
  },
  bindKeyUpdateAge: function (e) {
    this.setData({
      updateAge: e.detail.value
    })
  },
  bindKeyUpdateId: function (e) {
    this.setData({
      updateRecordId: e.detail.value
    })
  },

  bindKeyRemoveId: function (e) {
    this.setData({
      removeRecordId: e.detail.value
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