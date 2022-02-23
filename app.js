//app.js
import route from './utils/wx/route';

App({
  home: 0,
  userInfo: {},
  onLaunch(){
    var _this = this;
    /**
     * 获取自定义导航栏需要的相关数据
     */
    let menuButtonInfo = wx.getMenuButtonBoundingClientRect(); // 获取右上角胶囊按钮的布局位置信息
    wx.getSystemInfo({
      success: (res) => {
        let statusBarHeight = res.statusBarHeight;
        _this.globalData.totalHeight = statusBarHeight + menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2;
        _this.globalData.navTop = menuButtonInfo.top;
        _this.globalData.navLeft = res.windowWidth - menuButtonInfo.right;
        _this.globalData.navHeight = menuButtonInfo.height;
        _this.globalData.navWidth = menuButtonInfo.width;
        _this.globalData.screenWidth = res.screenWidth;
        _this.globalData.windowHeight = res.windowHeight;
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },

  onShow(){
    var _this = this;
    if(wx.getStorageSync('userInfo')){
      _this.userInfo = wx.getStorageSync('userInfo');
    }
  },

  /**
   * 用户授权
   * @param {*} isback  回调函数
   */
  goAuthor(isback){
    var _this = this;
    if(!wx.getStorageSync('userInfo')){
      wx.showModal({
        title: '授权提示',
        content: '是否前去授权？',
        success (res) {
          if (res.confirm) {
            route.navigateTo('/packages/main/pages/authorize/authorize');
          } 
          else if (res.cancel) {
            if(isback){
              wx.navigateBack({
                delta: 1
              });
            }
          }
        }
      });
    } else {
        if(_this.userInfo.wx_nickname){
        }else {
          _this.userInfo = wx.getStorageSync('userInfo');
        }
    }
  },

  /**
   * 获取或设置上个页面的数据
   * @param {*} types   'set' 或 'get'
   * @param {*} prevNum   上几个页面 
   * @param {*} setDatas  要设置的数据
   * @param {*} handle
   */
  prevData(types, prevNum, setDatas, handle){
    var _this = this;
    var pages = getCurrentPages(); // 获取当前页面栈
    
    var prevNumber = (prevNum?prevNum:0) + 1;
    var  prevPage = null;
    if (pages.length >= prevNumber) {
      prevPage = pages[pages.length - prevNumber];
    }
    if (types == 'set'){
      if (prevPage) {
        prevPage.setData(setDatas);
        if(handle){
          if(handle.tip_text){
            _this.showToast(handle.tip_text);
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1500)
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
          
        }
      }
    } else if (types == 'get'){
      return prevPage.data;
    }
  },

  globalData: {
    
  }
})