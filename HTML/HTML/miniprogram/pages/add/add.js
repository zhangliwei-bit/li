const db = wx.cloud.database().collection("books");
let Name = '';
let type = '';
let price = 0;
let phone = '';
let path = '';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: ['计算机类', '软件类', '英语类', '数学类', '化学类', '物理类', '生物类', '电子信息类', '历史类', '四六级专区', '文学类', '经济类', '哲学类', '思政类'],
    selectedType: '',
    uploadedImageUrl: '',
    files: [] ,// 存储上传的文件
   
  },
  
  selectype: function (e) {
    const selectedType = this.data.categories[e.detail.value];
    this.setData({
      selectedType: selectedType
    });
    type = selectedType;
  },
  
  handName(e) {
    Name = e.detail.value;
  },
  
  handType(e) {
    type = e.detail.value;
  },
  
  handPrice(e) {
    price = e.detail.value;
  },
  
  handPhone(e) {
    phone = e.detail.value;
  },
  
  handAdd() {
    if (Name !== '' && type !== '' && price > 0 && phone !== '') {
      db.add({
        data: {
          name: Name,
          type: type,
          price: price,
          phone: phone,
          picPath: path
        },
        success(res) {
          wx.showToast({
            title: '添加成功',
          });
        },
        fail(res) {
          wx.showToast({
            title: '添加失败',
          });
        }
      });
    } else {
      wx.showModal({
        title: '警告',
        content: '请检查输入数据',
      });
    }
    this.clearsec();
  },

  chooseImage() {
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认选择一张
      success: (res) => {
        const filePath = res.tempFilePaths[0]; // 获取选择的图片路径
        
        // 将选择的文件添加到文件列表中
        this.setData({
          files: [{ url: filePath }] // 预览显示
        });

        // 上传文件到云存储
        this.uploadFile(filePath);
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      }
    });
  },

  uploadFile(filePath) {
    // 上传到云存储
    wx.cloud.uploadFile({
      cloudPath: `images/${Date.now()}-${filePath.split('/').pop()}`,
      filePath: filePath,
      success: (uploadRes) => {
        console.log('上传成功:', uploadRes);
        path = uploadRes.fileID;
        // 更新文件信息，比如文件ID，可以根据需要保存
        this.setData({
          files: [{ url: filePath, fileID: uploadRes.fileID }] // 保存文件ID
        });
      },
      fail: (err) => {
        console.error('上传失败', err);
      }
    });
  },

  submit() {
    if (this.data.files.length > 0) {
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      });
      // 这里可以进行进一步操作，比如发送文件ID到服务器
    } else {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    //this.clearsec();
    
  },

  clearsec() {
    this.setData({
      selectedType: '',
      files: [] // 清空上传的文件列表
    });
    Name = '';
    type = '';
    price = 0;
    phone = '';
    path = '';
  },

  onShow() {
    const app = getApp();
    if (!app.globalData.login) {
      wx.navigateTo({
        url: '/pages/register/register',
      });
    } else {
      //this.clearsec(); // 这里可以在返回时清空输入
      
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    //this.clearsec();
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
});
