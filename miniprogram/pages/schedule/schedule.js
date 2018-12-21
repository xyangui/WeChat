// miniprogram/pages/schedule/schedule.js
import * as dateUtil from '../../utils/date'
//import { getInArray, indexOfArray } from '../../utils/util'
//import service from '../../utils/service'

const app = getApp()
  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    today: '',           
    firstDayCurWeek: '', // 当前周的第一天
    todayIndex: -1,      // 今天在本周内的索引0-6，-1表示不在当前周
    curYear: '',         // 显示的年
    curMonth: '',        // 显示的月
    curWeek: '第 xx 周',  // 当前周数
    curTitle: 'Intro Macro 2019 summmer', // 可以用来显示课程名称
    courseColors: ['#ffca7f', '#91d7fd', '#96a4f9'], // courseList[]对应的type决定颜色
    weekLabels: ['一', '二', '三', '四', '五', '六', '日'], //周一，周二...
    weekDates: [], // 显示一周的日期列表
    courseList: [] // 课程列表
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //var openid = app.globalData.openid //可以取得openid

    this.setData({
      today: new Date()
    })

    this.updateWeeks(this.data.today)
  },

  /**
   * 显示某日期（date）这周的课表
   */
  updateWeeks: function (date) {
    wx.showLoading({
      title: '加载中',
    })

    let today = this.data.today

    // 判断今天是否在当前页面里
    let todayIndex = -1
    if (date.getFullYear() == today.getFullYear() && 
        date.getMonth() == today.getMonth() && 
        dateUtil.getMonthWeekth(date) == dateUtil.getMonthWeekth(today)) {
          
      todayIndex = dateUtil.formatWeekOrder(today.getDay()) 
    }

    let firstDayCurWeek = dateUtil.getWeekFirstDate(date) //Date类型，获取当前周第一天，确定月份
    let curYear = firstDayCurWeek.getFullYear()
    let curMonth = firstDayCurWeek.getMonth() + 1
 
    // 计算一周的日期列表
    let weekDates = []
    let tmpFirstDate = new Date(firstDayCurWeek)
    for (var i = 0; i < 7; i++) {
      if (i == 0) {
        weekDates.push(firstDayCurWeek.getDate())
      } else {
        weekDates.push(dateUtil.getDiffDate(tmpFirstDate, 1).getDate())
      }
    }

    /**
     * type: =0只显示course，对应颜色：courseColors[]
     * day: =0周一，=1周二，=2周三
     * start: 第几节课开始，1...12
     * sections: 一共上几节课
     * 
     * 还要添加‘年月日’，光有周几不够，是否添加具体时间1:30-4:30？
     */
    let courseList = [
      { id: 0, type: 0, day: 0, start: 1, sections: 2, course: "语文", teacher: "刘德华", place: "大钟寺" },
      { id: 1, type: 1, day: 1, start: 5, sections: 2, course: "数学", teacher: "谢霆锋", place: "五道口" },
      { id: 2, type: 2, day: 2, start: 1, sections: 2, course: "英语", teacher: "小明", place: "科贸" },
      { id: 3, type: 2, day: 5, start: 1, sections: 2, course: "英语", teacher: "小明", place: "科贸" }
    ]

    this.setData({
      todayIndex: todayIndex,
      firstDayCurWeek: firstDayCurWeek,
      curYear: curYear,
      curMonth: curMonth,
      weekDates: weekDates,
      courseList: courseList
    })

    wx.hideLoading()
  },

  /**
   * 上一周
   */
  prevWeekHandler: function (event) {
    this.updateWeeks(dateUtil.getDiffDate(this.data.firstDayCurWeek, -7))
  },

  /**
   * 下一周
   */
  nextWeekHandler: function (event) {
    this.updateWeeks(dateUtil.getDiffDate(this.data.firstDayCurWeek, 7))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})