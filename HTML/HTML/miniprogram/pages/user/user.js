// pages/my/my.js
let path=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadedImageUrl: '',
    files: [] ,
    name:'帅气小子',
    phone:''
  },
  navigateToProfile() {
    const phone=this.data.phone
    wx.redirectTo({ url: `/pages/person/person?phone=${phone}` });
  },
  confirmLogout() {
    wx.showModal({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          
          var app=getApp();
          app.globalData.login=false
          this.logout(); // 调用退出登录的逻辑
        }
      }
    });
  },
  logout() {
    wx.clearStorageSync(); // 清除缓存
    wx.redirectTo({
      url: '/pages/register/register'
    });
  },
  chooseImage() {
    wx.chooseImage({
      count: 1, 
      success: (res) => {
        const filePath = res.tempFilePaths[0]; 
        
        
        this.setData({
          files: [{ url: filePath }] 
        });
  
        this.uploadFile(filePath);
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      }
    });
  },
  
  uploadFile(filePath) {
    const that = this; 
    
    wx.cloud.uploadFile({
      cloudPath: `images/${Date.now()}-${filePath.split('/').pop()}`,
      filePath: filePath,
      success: (uploadRes) => {
        console.log('上传成功:', uploadRes);
        const fileID = uploadRes.fileID; 
        this.setData({
          files: [{ url: filePath, fileID }] 
        });
        this.updateUserPicPath(fileID); 
      },
      fail: (err) => {
        console.error('上传失败', err);
      }
    });
  },
  
  updateUserPicPath(fileID) {
    const db = wx.cloud.database(); 
    const phone = this.data.phone; 
  
    db.collection('user').where({
      phone
    }).update({
      data: {
        picPath: fileID 
      },
      success: () => {
        console.log('图片路径更新成功');
        wx.showToast({
          title: '图片上传成功',
        });
      },
      fail: (err) => {
        console.error('更新失败', err);
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
      }
    });
  },
  getUserInfoByPhone() {
    const db = wx.cloud.database(); 
    const phone=this.data.phone
   
    db.collection('user') 
      .where({
        phone
      })
      .get({
        success: (res) => {
          if (res.data.length > 0) { // 检查数据是否存在
            const userInfo = res.data[0];
            this.setData({
              name: userInfo.name,
              files: [{ url: userInfo.picPath }]
            });
          } else {
            wx.showToast({
              title: '用户不存在',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('获取用户信息失败', err);
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          });
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var app=getApp()
this.setData({
  phone:app.globalData.phone
})
this.getUserInfoByPhone() 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getUserInfoByPhone() 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var app=getApp();
    if(!app.globalData.login){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    this.getUserInfoByPhone() 
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