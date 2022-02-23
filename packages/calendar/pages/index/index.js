// packages/calendar/pages/index/index.js
import route from '../../../../utils/wx/route';
import api from '../../../../utils/api/order';
import view from '../../../../utils/wx/view';

//获取应用实例
const app = getApp()

Page({
  data: {
    riliData:[],// 所有日历数据
    isSelect: false, // 是否选择了日期
    bookData:[],// 存放已经预定了的数据

    selectDate:{// 选择的日期
      start:{
        year:'',
        month:'',
        day:'',
        curMainIndex: -1,// 当前时间月份索引
      },
      end: {
        year:'',
        month:'',
        day:'',
        curMainIndex: -1,// 当前时间月份索引
      }
    },
    
    curDateObj:{// 当前日期数据
      wzDate:20200920,
      curYear:2020,
      curMonth:9,
      curDay:20
    },

    clickNums:0,// 选择日期点击的次数
    nightNum:0,// 夜晚数量
  },
  
  onLoad: function (options) {
    var _this  = this;
    if(options.iid){
      view.showLoading('正在加载');
      api.getBookDate({iid: Number(options.iid)})
      .then(res => {
        var data = {
          bookData: res
        }
        _this.setData(data);
        _this.initRili(0, 12);
        view.hideLoading();
      }).finally(err => {
        view.hideLoading();
      });
    }else{
      _this.initRili(0, 12);
    }
  },

  onShow: function () {
  },

  /**
   * 初始化日历
   */
  initRili: function (curIndex, num) {
    var _this = this;
    var riliData = [];
    // 获取当前日期
    var curTimes = new Date();
    var curYear = curTimes.getFullYear();// 获取当前年份
    var curMonth = curTimes.getMonth() + 1;// 获取当前月份
    var curDay = curTimes.getDate();// 获取当前日期天
    // 大于12，跳转到下一年；小于12，继续使用当前时间
    while(curIndex<num){
      var year,month;
      if(curMonth+curIndex>12){
        year = curYear + 1;
        month = curMonth + curIndex - 12;
      }else{
        year = curYear;
        month = curMonth + curIndex;
      }
      // 初始化日历
      var riliObj = {};
      var date = new Date(year, month, 0);// 获取其时间
      var hasday = date.getDate();// 获取其月有几天
      var firstday = new Date(date.setDate(1));// 获取其月的第一天的时间
      riliObj.riliTitle = (year==curYear?'':year+'年') + month + '月';
      riliObj.riliNull = firstday.getDay();// 获取其月的第一天是星期几并设置其初始空位
      riliObj.riliHasday = hasday
      riliObj.year = year;
      riliObj.month = month;
      riliObj.riliList = [];
      for(var i=0; i<hasday; i++){
        var dateObj = {};
        var day = i + 1;
        dateObj.wzDate = year + '' + (month>=10?month:0+''+month) + '' + (day>=10?day:0+''+day);
        dateObj.year = year;
        dateObj.month = month;
        dateObj.day = day;
        dateObj.select = false;
        dateObj.isBook = false;
        _this.data.bookData.forEach(element => {// 判断该日期是否别人已经预定了
          if(element==dateObj.wzDate){
            dateObj.isBook = true;
          }
        });  
        riliObj.riliList[i] = dateObj;
      } 
      riliData.push(riliObj);
      curIndex++;
    }

    var selecDateObj = wx.getStorageSync('selectDate'); 
    var nightN = wx.getStorageSync('nightNum');
    if( selecDateObj && selecDateObj.end.year!='') {
      _this.setData({
        riliData: riliData,
        curDateObj:{
          wzDate:Number(curYear+''+(curMonth>=10?curMonth:0+''+curMonth)+''+(curDay>=10?curDay:0+''+curDay)),
          curYear:curYear,
          curMonth:curMonth,
          curDay:curDay
        },
        selectDate: (selecDateObj.end.year!=''?selecDateObj:''),
        nightNum: (nightN?nightN:0),
        isSelect: true
      });
      _this.changeSelectStatus(selecDateObj.start, selecDateObj.end, true);
    }else{
      _this.setData({
        riliData: riliData,
        curDateObj:{
          wzDate:Number(curYear+''+(curMonth>=10?curMonth:0+''+curMonth)+''+(curDay>=10?curDay:0+''+curDay)),
          curYear:curYear,
          curMonth:curMonth,
          curDay:curDay
        }
      });
    }
  },

  /**
   * 选择日期
   */
  selectDays(e){
    var _this = this;
    var datas = _this.data;
    var selectObj = datas.selectDate;

    if(selectObj.end.year!='') { // 清理选中状态
      _this.changeSelectStatus(selectObj.start, selectObj.end, false);
    }
    var eData = e.currentTarget.dataset;
    var curYears = eData.curyear;// 点击的当前年份
    var curMonths = eData.curmonth;// 点击的当前月份
    var curDays = eData.curday;// 点击的当前时间天
    var curMainIndex = eData.curmindex;// 所有数组的主索引
    var curClickNum = datas.clickNums+1;// 点击次数

    // 设置开始时间
    if(curClickNum==1){
      _this.clearSelect();
      var setCurSelect = 'riliData['+curMainIndex+'].riliList['+(curDays-1)+'].select';
      _this.setData({
        ['selectDate.start']: {
          year: curYears,
          month: curMonths,
          day: curDays,
          curMainIndex: curMainIndex
        },
        [setCurSelect]: true,
        clickNums: curClickNum
      });
      _this.changeBookStatus(true);
    }

    // 设置开始时间到结束时间
    if(curClickNum==2){
      // 如果第二次点击还是同一个时间，将不执行下面的方法
      if(curYears==selectObj.start.year && curMonths==selectObj.start.month && curDays==selectObj.start.day){
        return false;
      }
      // 判断第二次点击是否小于前面那次的日期，如果小于就重新设置第一个，如果大于就设置结束日期
      if((curYears<selectObj.start.year) || (curYears==selectObj.start.year&&curMonths<selectObj.start.month) || (curYears==selectObj.start.year&&curMonths==selectObj.start.month&&curDays<selectObj.start.day)){
        // 当前点击小于上一次的时间
        var setPrevSelect = 'riliData['+selectObj.start.curMainIndex+'].riliList['+(selectObj.start.day-1)+'].select';
        var setCurSelect = 'riliData['+curMainIndex+'].riliList['+(curDays-1)+'].select';
        _this.setData({
          ['selectDate.start']:{
            year: curYears,
            month: curMonths,
            day: curDays,
            curMainIndex: curMainIndex
          },
          clickNums: 1,
          [setPrevSelect]: false, // 取消上一个的选中
          [setCurSelect]: true, // 设置当前选中的
        });
        _this.changeBookStatus(true);
      }else{
        // 当前点击大于上一次时间
        _this.changeSelectStatus(selectObj.start, {year:curYears, month:curMonths, day:curDays, curMainIndex:curMainIndex}, true);
        _this.setData({
          ['selectDate.end']:{
            year: curYears,
            month: curMonths,
            day: curDays,
            curMainIndex: curMainIndex
          },
          clickNums: 0,
          isSelect: true
        });
        _this.changeBookStatus(false);
      }
    }
  },

  /**
   * 改变日期范围内的选中状态
   */
  changeSelectStatus(startObj, endObj, status){
    var _this = this;
    var datas = _this.data;
    var startIndex = startObj.curMainIndex;
    var endIndex = endObj.curMainIndex;
    var startWzDate = startObj.year +''+ (startObj.month>=10?startObj.month:0+''+startObj.month) +''+ (startObj.day>=10?startObj.day:0+''+startObj.day);
    var endWzDate = endObj.year +''+ (endObj.month>=10?endObj.month:0+''+endObj.month) +''+ (endObj.day>=10?endObj.day:0+''+endObj.day);
    var riliData = datas.riliData;
    var nightNum = -1;
    for(startIndex; startIndex<=endIndex; startIndex++){
      riliData[startIndex].riliList.forEach(element => {
        if(element.wzDate>=startWzDate && element.wzDate<=endWzDate){
          element.select = status;
          nightNum++;
        }
      });
    }
    _this.setData({
      riliData: riliData,
      nightNum: nightNum
    });
  },

   /**
   * 改变范围内的预订状态
   */
  changeBookStatus(flag){
    var _this = this;
    var datas = _this.data;
    var startYear = datas.selectDate.start.year;
    var startMonth =  datas.selectDate.start.month;
    var StartDay = datas.selectDate.start.day;
    var startWzDate =startYear +''+ (startMonth>=10?startMonth:0+''+startMonth) +''+ (StartDay>=10?StartDay:0+''+StartDay);
    if(datas.bookData.length>0){
      var wzDateList = [];
      datas.bookData.forEach(element => {
        if(element>startWzDate)
         wzDateList.push(element);
      });
      var minWzDate = Math.min.apply(null, wzDateList);
      var riliData = datas.riliData;
      if(flag){
        riliData.forEach(element => {
          element.riliList.forEach(element2 => {
            if(element2.wzDate>minWzDate){
              element2.isBook = true;
            }
            if(element2.wzDate==minWzDate){
              element2.isBook = false;
            }
          })
        });
      }else{
        riliData.forEach(element => {
          element.riliList.forEach(element2 => {
            if(element2.wzDate>minWzDate){
              element2.isBook = false;
            }
            wzDateList.forEach(element3 => {
              if(element3==element2.wzDate){
                element2.isBook = true;
              }
            });
          })
        });
      }
      _this.setData({
        riliData: riliData
      }); 
    } 
  },
  
  /**
   * 清空选中日期
   */ 
  clearSelect(){
    var _this = this;
    var selectObj = _this.data.selectDate;
    if(selectObj.end.year!=''){
      _this.changeSelectStatus(selectObj.start, selectObj.end, false);
      _this.setData({
        selectDate:{
          start: {
            year: '',
            month: '',
            day: '',
            curMainIndex: ''
          },
          end: {
            year: '',
            month: '',
            day: '',
            curMainIndex: ''
          }
        },
        clickNums: 0,
        isSelect: false,
        nightNum: 0,
      });
      wx.setStorage({
        key: 'selectDate',
        data: _this.data.selectDate,
      });
      wx.setStorage({
        key: 'nightNum',
        data: _this.data.nightNum,
      });
    }
  },

  /**
   * 缓存选中日期，用于其他页面
   */
  saveSelect(){ 
    var _this = this;
    var selectObj = _this.data.selectDate;
    wx.setStorage({
      key: 'curDateObj',
      data: _this.data.curDateObj
    });
    if(selectObj.end.year!=''){
      wx.setStorage({
        key: 'selectDate',
        data: _this.data.selectDate,
      });
      wx.setStorage({
        key: 'nightNum',
        data: _this.data.nightNum,
      });
    }
    route.navigateBack();
  }
})


