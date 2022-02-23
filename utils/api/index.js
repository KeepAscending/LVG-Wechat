import request from './request';

export default{
  /**
   * 获取 banner
   */
  getBan(data = {}){
    return request({
      url: '8082/advert/show',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  },
  /**
   * 获取 recommend
   */
  getRecommend(data = {}){
    return request({
      url: '',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  }
}
