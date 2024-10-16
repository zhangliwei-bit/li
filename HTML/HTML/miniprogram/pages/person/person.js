// pages/person/person.js
let path=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
phone:'',
uploadedImageUrl: '',
    files: [] ,
    name:'',
    
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
            this.setData({
              name: res.data[0].name
            });
            
          } ,
        fail: (err) => {
          console.error('获取用户信息失败', err);
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          });
        }
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
    const phone = this.data.phone; // 获取当前用户的手机号
  
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
              files: [{ url: userInfo.picPath }] // 从数据库获取图片路径
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
  changeName() {
    const that = this; 
    const phone = this.data.phone; 
    
    wx.showModal({
      title: '修改昵称',
      content: '请输入新的昵称',
      editable: true, // 允许用户编辑
      placeholderText: '新的昵称', 
      success(res) {
        if (res.confirm) {
          const newName = res.content; 
          if (newName) {
            that.setData({
              name: newName 
            });
            that.updateUserName(newName);
            wx.showToast({
              title: '昵称修改成功',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '昵称不能为空',
              icon: 'none'
            });
          }
        } else if (res.cancel) {
          
          console.log('用户取消了昵称修改');
        }
      }
    });
  },

  updateUserName(newName) {
    const db = wx.cloud.database();
    const phone=this.data.phone
    db.collection('user')
      .where({ phone: phone }) 
      .update({
        data: {
          name: newName ,
          
        },
        success: (res) => {
          console.log('昵称更新成功', res);
          console.log(newName)
          wx.showToast({
            title: '昵称更新成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          console.error('昵称更新失败', err);
          wx.showToast({
            title: '昵称更新失败',
            icon: 'none'
          });
        }
      });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      phone:options.phone
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