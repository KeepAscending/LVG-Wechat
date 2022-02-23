// components/cell/cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    center: {
      type: Boolean,
      value: true
    },
    clickabled: {
      type: Boolean,
      value: false
    },
    href: {
      type: String,
      value: ''
    },
    linkType: {
      type: String,
      value: 'navigateTo'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(){
      if(this.data.href){
        wx[this.data.linkType]({
          url: this.data.href
        });
      }else{
        this.triggerEvent('click');
      }
    }
  },

  externalClasses: [
    'custom-class'
  ],

  options: {
    multipleSlots: true  // 在组件定义时的选项中启用多slot支持
  }
})
