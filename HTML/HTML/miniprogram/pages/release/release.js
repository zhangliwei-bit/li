// pages/release/release.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    releaseList: [],
    isLoading: false, // 加载状态
    hasMoreData: true // 是否还有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const app = getApp();
    this.setData({
      phone: app.globalData.phone
    });

    // 初次加载数据
    await this.loadData();
    wx.setNavigationBarTitle({
      title: "我的发布" // 使用 data 中的 name
    });
  },

  // 加载数据的方法
  async loadData() {
    if (this.data.isLoading || !this.data.hasMoreData) {
      return; // 如果正在加载或者没有更多数据，则返回
    }

    this.setData({ isLoading: true }); // 设置加载状态
    let allData = this.data.releaseList; // 保留已加载数据
    let skipNum = allData.length; // 跳过的文档数

    try {
      const res = await db.collection('books').where({
        $or: [
          { phone: this.data.phone }, // 字符串类型
          { phone: this.data.phone } // 保持一致性，不进行数字转换
        ],
      }).skip(skipNum).limit(20).get();

      allData = allData.concat(res.data); // 合并新数据
      this.setData({ releaseList: allData }); // 更新页面数据

      if (res.data.length < 20) {
        this.setData({ hasMoreData: false }); // 如果返回数据少于限制，则没有更多数据
      }
    } catch (error) {
      console.error("获取数据失败：", error);
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ isLoading: false }); // 重置加载状态
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    // 清空旧数据并重置状态
    this.setData({
      releaseList: [],
      hasMoreData: true // 重置是否还有更多数据
    });

    // 重新加载数据
    await this.loadData();
    
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    await this.loadData(); // 加载更多数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // 实现分享功能
  }
});
