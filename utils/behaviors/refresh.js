export default Behavior({
  data: {
    page: 1,
    hasMore: false,
    list: [],
    isLoading: false //是否加载中
  },

  methods: {
    // 监听用户下拉动作
    onPullDownRefresh(){
      console.log(" 监听用户下拉动作");
      this.refresh().then(() => {
        wx.stopPullDownRefresh();
      })
    },

    // 页面上拉触底事件的处理函数
    onReachBottom(){
      var _this = this;
      var data = _this.data;
      console.log(" 页面上拉触底事件的处理函数");
      if(data.isLoading){
        return false;
      }
      if(data.hasMore){
        _this.setData({
          isLoading: true
        });
        _this.refresh(Number(data.page) + 1).then(() => {
          _this.setData({
            isLoading: false
          });
        });
      }
    }
  }
})