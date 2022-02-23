// components/modal/modal.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,

      observer(newVal){
        if(newVal){
          this.setData({
            display: true
          });
        }else if(!this.data.useAnimation){
          this.setData({
            display: false
          });
        }
      }
    },

    position: {
      type: String,
      value: 'center'
    },

    useAnimation: {
      type: Boolean,
      value: true
    }
  },

  data: {
    display: false
  },

  methods: {
    preventTouchMove(){},
    onClose(){
      this.triggerEvent('close');
    },
    onAnimationEnd(){
      if(!this.data.show){
        this.setData({
          display: false
        });
      }
    }
  },
  
  externalClasses: [
    'custom-class',
    'mask-class',
    'main-class'
  ]
})
