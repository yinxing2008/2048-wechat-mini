//厦门大学计算机专业 | 前华为工程师
//专注《零基础学编程系列》  http://lblbc.cn/blog
//包含：Java | 安卓 | 前端 | Flutter | iOS | 小程序 | 鸿蒙
//公众号：蓝不蓝编程
App({

  serverUrl: "http://lblbc.cn/",
  userInfo: "",

  setGlobalUserInfo: function (user) {
    //设置用户对象为缓存的方法(key,data)
    wx.setStorageSync("userInfo", user);
  },

  getGlobalUserInfo: function () {
    //获取缓存的用户对象
    return wx.getStorageSync("userInfo");
  },

  onLaunch: function () {
  },
})