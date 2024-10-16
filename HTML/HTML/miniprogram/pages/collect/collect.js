// pages/collect/collect.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    collectList: [],
    productList: [],
    isLoading: false, // 加载状态
    hasMoreData: true // 是否还有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const app = getApp();
    this.setData({
      phone: app.globalData.phone,
    });
    console.log("用户电话:", this.data.phone);

    await this.loadData(); // 确保数据加载完成

    wx.setNavigationBarTitle({
      title: "我的收藏" // 使用 data 中的 name
    });
  },

  // 加载数据的方法
  async loadData() {
    if (this.data.isLoading || !this.data.hasMoreData) {
      return; // 如果正在加载或没有更多数据，直接返回
    }

    this.setData({ isLoading: true }); // 设置加载状态
    let allData = this.data.collectList; // 保留已加载数据
    let skipNum = allData.length; // 跳过的文档数

    try {
      while (this.data.hasMoreData) {
        // 第一次查询 collect 集合
        const res = await db.collection('collect').where({
          personPhone: this.data.phone
        }).skip(skipNum).limit(20).get();

        allData = allData.concat(res.data); // 合并新数据
        skipNum += 20;

        if (res.data.length < 20) {
          this.setData({ hasMoreData: false }); // 如果返回数据少于限制，则没有更多数据
        }

        // 更新 collectList 数据
        this.setData({ collectList: allData });

        // 检查 collectList 是否有数据
        if (allData.length > 0) {
          // 如果有数据，进行第二次查询 books 集合
          const promises = allData.map(item => {
            return db.collection('books').where({
              $or: [
                { phone: item.phone }, // 字符串类型
                { phone: Number(item.phone) } // 数字类型
              ],
              name: item.name
            }).get();
          });

          // 等待所有查询完成
          const results = await Promise.all(promises);
          const allProducts = results.flatMap(res => res.data);
          this.setData({ productList: allProducts }); // 更新产品列表
          console.log("所有产品:", allProducts);
        }
      }
    } catch (err) {
      console.error("获取收藏数据失败：", err);
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
    this.setData({
      collectList: [],
      productList: [],
      hasMoreData: true // 重置是否还有更多数据
    });

    await this.loadData(); // 重新加载数据
    wx.stopPullDownRefresh(); // 停止下拉刷新
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
