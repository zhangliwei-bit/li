// pages/detail/detail.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:false,
    name:"",
    phone:"",
    price:"",
    img:"",
    personPhone:""
  },

  goBack(){
    wx.navigateBack({
      delta: 1 // 返回上一个页面
    });
  },

  collectit(){
    db.collection('collect').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        personPhone: this.data.personPhone,
        name:this.data.name,
        phone:this.data.phone
        
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        
      }
    })
    wx.showModal({
      title: '提示',
      content: '您已成功收藏！',
      showCancel: false, // 是否显示取消按钮
      cancelText: '取消', // 取消按钮的文字，默认是“取消”
      confirmText: '确定', // 确定按钮的文字，默认是“确定”
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.navigateBack({
            delta: 1 // 返回上一个页面
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },

  purchase(){
    wx.showModal({
      title: '提示',
      content: '您已成功购买！',
      showCancel: true, // 是否显示取消按钮
      cancelText: '取消', // 取消按钮的文字，默认是“取消”
      confirmText: '确定', // 确定按钮的文字，默认是“确定”
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.navigateBack({
            delta: 1 // 返回上一个页面
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var app=getApp()
    this.setData({
      name:options.name,
      phone:options.phone,
      img:options.img,
      price:options.price,
      personPhone:app.globalData.phone
    }),
    console.log(this.data),
    wx.setNavigationBarTitle({
      title: this.data.name // 使用 data 中的 name
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
    //信息访问成功后加入
    this.setData({
      detail:true
    })
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
    return {
      path:"/pages/detail/detail"
    }
  },
  //分享朋友圈
  onShareTimeLine() {

  }
})