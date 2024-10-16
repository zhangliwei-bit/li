// pages/cate/cate.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftList: [
      "计算机类", "软件类", "英语类", "数学类", "化学类",
      "物理类", "生物类", "电子信息类", "历史类", "四六级专区",
      "文学类", "经济类", "哲学类", "思政类",
    ],
    cateArr: Array(14).fill([]), // 创建一个包含14个空数组的cateArr
    loading: false,
    isData: false,
    navActive: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { idx } = options;
    if (idx == null) idx = 0;
    this.navChange(idx);

    // 使用 this.data.leftList 遍历所有左侧列表并加载数据
    this.data.leftList.forEach((item, index) => {
      this.getCateData(item, index);
    });
  },

  // 导航切换
  navChange(e) {
    const index = e?.detail?.index ?? e; // 获取当前 tab 的索引
    this.setData({
      navActive: Number(index), // 更新激活的 tab 索引
    });
  },

  getCateData(tp, idx) {
    wx.cloud.callFunction({
      name: "demoGetList",
      data: { type: tp }
    }).then(res => {
      const updatedCateArr = this.data.cateArr; // 获取当前的 cateArr
      updatedCateArr[idx] = res.result.data; // 更新指定索引的数据

      this.setData({
        cateArr: updatedCateArr,
        loading: true
      });

      // 检查所有分类是否都加载完毕
      if (updatedCateArr.every(arr => arr.length > 0)) {
        this.stopLoading();
      }
    }).catch(err => {
      console.error("获取分类数据失败:", err);
      this.stopLoading(); // 如果请求失败，仍然需要停止加载状态
    });
  },

  stopLoading() {
    this.setData({
      loading: false
    });
  },

  onShow() {
    this.stopLoading();
    var app = getApp();
    if (!app.globalData.login) {
      wx.navigateTo({
        url: '/pages/register/register',
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 清空当前激活的分类的数据
    const currentIndex = this.data.navActive;
    this.setData({
      [`cateArr[${currentIndex}]`]: [],
      isData: false,
      loading: false,
    });

    // 重新获取当前分类的数据
    this.getCateData(this.data.leftList[currentIndex], currentIndex);
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 无更多数据进行节流
    if (this.data.isData) return;
    // 这里可以实现加载更多数据的逻辑
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // 实现分享功能
  }
});
