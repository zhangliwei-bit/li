// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
phone:'',
password:'',
isLogin:true
  },
  onInput(e){
    const data = e.target.dataset; // 使用 dataset
    if (data && data.type) {
        const { type } = data;
        this.setData({
            [type]: e.detail.value
        });
        
    } else {
        console.error('data is undefined or does not have type:', data);
    }
  },
  toggleLoginMode() {
    this.setData({
      isLogin: !this.data.isLogin,
      phone: '',
      password: ''
    });
  },
  handleSubmit() {
    if (this.data.isLogin) {
      this.login();
    } else {
      this.register();
    }
  },
  login() {
    const { phone, password } = this.data;

    const db = wx.cloud.database();
    db.collection('user').where({ phone }).get({
      success: (res) => {
        if (res.data.length === 0) {
          // 用户不存在
          wx.showToast({ title: '用户不存在', icon: 'none' });
        } else if (res.data[0].password !== password) {
          // 密码错误
          wx.showToast({ title: '密码错误', icon: 'none' });
        } else {
          // 登录成功
          wx.showToast({ title: '登录成功' });
          wx.redirectTo({ url: `/pages/my/my?phone=${phone}` });
          var app=getApp();
          app.globalData.login=true;
          app.globalData.phone=this.data.phone;
          app.globalData.password=this.data.password;
          wx.reLaunch({
          
            url: '/pages/index/index',
          })
          // wx.navigateBack({
          //   delta: 1 // 返回上一个页面
          // });
        }
      },
      fail: () => {
        // 请求失败
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    });
},

register() {
  const { phone, password } = this.data;

  // 检查手机号长度是否为11位
  if (phone.length !== 11) {
      wx.showModal({
          title: '警告',
          content: '手机号必须是11位',
      });
      this.setData({
        phone: '',
        password: ''
      });
      return;
  }

  // 检查手机号是否为数字
  if (isNaN(phone)) {
      wx.showModal({
          title: '警告',
          content: '手机号必须是数字',
      });
      this.setData({
        phone: '',
        password: ''
      });
      return;
  }

  const db = wx.cloud.database();

  // 查询手机号是否已存在
  db.collection('user').where({ phone }).get({
      success: (res) => {
          if (res.data.length > 0) {
              wx.showModal({
                  title: '警告',
                  content: '该手机号已注册',
              });
              this.setData({
                phone: '',
                password: ''
              });
          } else {
              // 手机号不存在，进行注册
              db.collection('user').add({
                  data: {
                      phone,
                      password 
                  },
                  success: () => {
                      wx.showToast({ title: '注册成功' });
                      this.setData({ isLogin: true }); 
                  },
                  fail: (err) => {
                      console.error('注册失败:', err);
                      wx.showToast({ title: '注册失败', icon: 'none' });
                  }
              });
          }
      },
      fail: (err) => {
          console.error('查询失败:', err);
          wx.showToast({ title: '查询失败', icon: 'none' });
      }
  });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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