export default {
  host: 'http://192.168.40.1:', //https://www.baidu.com/
  domain: '', //https://www.baidu.com
  mediaHost: 'http://192.168.249.131/',
  getRequestPrefix(){
    return this.host; //this.host + 'api/index/'
  }
}
