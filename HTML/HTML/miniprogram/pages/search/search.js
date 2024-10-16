// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: { historyList:[],
    productList:[],
    total:0,
    keyword:"",
    noData:false

  },
  //输入框改变的时候
  onChange(e){  
    this.setData({
      keyword:e.detail
    })
  },
  onSearch(){
    console.log(this.data.keyword);
    let hisArr = this.data.historyList || [];
    hisArr.unshift(this.data.keyword);
    hisArr = [...new Set(hisArr)];
    hisArr = hisArr.slice(0,10)
    this.setData({
      historyList:hisArr
    })
    wx.setStorageSync('searchKeyArr', hisArr);
    this.getData()
  },

  //清空输入框
  onClear(){
    this.setData({
      noData:false,
      keyword:"",
      productList:[],
      total:0
    })
  },
  tapHisItem(e){
    console.log(e);
    this.setData({
      keyword:e.currentTarget.dataset.value
    })
    this.getData();
  },
  removeHistory(){
    this.setData({
      noData:false,
      historyList:[],
      total:0,
      keyword:"",
      productList:[]
    })
    wx.removeStorageSync('searchKeyArr')
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let searchKeyArr = wx.getStorageSync('searchKeyArr') || null;
    if(searchKeyArr){
      this.setData({
       historyList:searchKeyArr
      })
    }  
  },
   async getData(){
    const db=wx.cloud.database()
 const keyword=this.data.keyword
 let allData = [];
 let hasMoreData = true; // 标识是否还有更多数据
 let skipNum = 0; // 跳过的文档数

 while (hasMoreData) {
     const res = await db.collection('books').where({
         name: db.RegExp({
             regexp: keyword,
             options: 'i' // 忽略大小写
         })
     })
     .skip(skipNum) // 跳过已经获取的数量
     .limit(20) // 每次获取20条
     .get();

     allData = allData.concat(res.data); // 合并数据
     skipNum += 20; // 增加跳过的数量

     if (res.data.length < 20) { // 如果返回的数据少于20条，表示没有更多数据
         hasMoreData = false;
     }
 }

 let noData = allData.length === 0; // 判断是否有数据
 this.setData({
     total: allData.length,
     productList: allData,
     noData
 });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})