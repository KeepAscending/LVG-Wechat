// components/navBar/navBar.js
import route from '../../utils/wx/route';

const app = getApp();
 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showNav: {
      type: Boolean,
      value: true
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    tatalHeight : app.globalData.totalHeight,
    navTop : app.globalData.navTop,
    navLeft : app.globalData.navLeft,
    navWidth : app.globalData.navWidth,
    navHeight : app.globalData.navHeight
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 回退
    navBack: function () {
      route.navigateBack();   
    },
    // 回主页
    toIndex: function () {
      route.reLaunch('/packages/main/pages/index/index');
    },
  }
})