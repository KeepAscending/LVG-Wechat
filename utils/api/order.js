import request from './request';

export default {
  // 获取 bookDate
  getBookDate(data = {}){
    return request({
      url: '8086/order/bookdate',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  },

  // 新增订单
  onBook(data = {}){
    return request({
      url: '8086/order',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  },

  // 订单列表
  showList(data = {}){
    return request({
      url: '8086/order/list',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
       }
    });
  },

  // 更新订单
  updateOrder(data = {}){
    return request({
      url: '8086/order/update',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        }
    });
  },

  // 新增订单评价
  addOrderEval(data = {}){
    return request({
      url: '8086/orderEval/add',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        }
    });
  },
}