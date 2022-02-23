import request from './request';

export default {
  // 获取房型列表
  getItemList(data = {}){
    return request({
      url: '8083/search',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  },

  // 获取房型详情
  getItemDetail(data = {}){
    return request({
      url: '8081/item/detail',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  },

  // 收藏房型
  collectItem(data = {}){
    return request({
      url: '8085/collect',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  },

  // 获取收藏列表
  getCollectList(data = {}){
    return request({
      url: '8085/collect/list',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        }
    });
  },

  // 发布房型
  newItem(data = {}){
    return request({
      url: '8081/item/add',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        }
    });
  },

  // 根据房源Id获取房型列表
  getItemByGid(data = {}){
    return request({
      url: '8081/item/list',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        }
    });
  },

  // 修改房型
  updItem(data = {}){
    return request({
      url: '8081/item/update',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        }
    });
  },
}