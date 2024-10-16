const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latest: [],
    login: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkLogin();
    this.getLatestData();
  },

  /**
   * 检查用户登录状态
   */
  checkLogin() {
    const app = getApp();
    if (!app.globalData.login) {
      wx.navigateTo({
        url: '/pages/register/register',
      });
    }
  },

  /**
   * 获取最新数据
   */
  getLatestData() {
    db.collection('books').orderBy("price", "asc").limit(3).get()
      .then(res => {
        // res.data 包含该记录的数据
        console.log(res.data);
        this.setData({
          latest: res.data
        });
      })
      .catch(err => {
        console.error("获取数据失败:", err);
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkLogin();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 重新获取最新数据
    this.getLatestData();
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 可以实现加载更多数据的逻辑
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
});
