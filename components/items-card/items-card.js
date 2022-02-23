// components/items-card/items-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id:{
      type: Number,
      value: 0
    },
    iid:{
      type: Number,
      value: 0
    },
    image:{
      type: String,
      value: '#'
    },
    housetype:{
      type: String,
      value: '--'
    },
    room:{
      type: Number,
      value: 0
    },
    toilet:{
      type: Number,
      value: 0
    },
    beds:{
      type: Number,
      value: 0
    },
    people:{
      type: Number,
      value: 0
    },
    price:{
      type: Number,
      value: 0
    },
    title:{
      type: String,
      value: '--'
    },
    eval:{
      type: Number,
      value: 0
    },
    index:{
      type: Number,
      value: 0
    },
    iscollect:{
      type: Boolean,
      value: false
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
    onChange(e){
      let index = e.currentTarget.dataset.curindex;
      this.triggerEvent('change', {index}, {});
    }
  },

  externalClasses: [

  ]
})
