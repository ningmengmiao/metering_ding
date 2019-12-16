import { ENV } from '../../profile'
Page({
  data: {

    show: false,
    loading: false,
    to: "",

  },
  onLoad() {


    my.getStorage({
      key: 'user', // 缓存数据的key
      success: (res) => {
        this.setData({
          email: res.data.email
        })
      },
    });
    my.getStorage({
      key: 'to', // 缓存数据的key
      success: (res) => {
        this.setData({
          to: res.data.to
        })
      },
    });

  },

  onPromptTap() {

    this.setData({
      show: "true",
    })
  },
  btn1() {
    var that = this
    if (this.data.email === null) {

      dd.alert({
        title: '',
        content: '请先设置常用邮箱',

      });
    }
    else {
      that.setData({

        loading1: true,
      })
      my.httpRequest({

        url: ENV.domain + '/metering/sendMail', // 目标服务器url
        data: {
          email: that.data.email
        },
        success: (res) => {
          that.setData({
            loading1: false
          })
          if (res === "200") {
            dd.alert({
              title: '',
              content: '发送成功',

            });
            my.setStorage({
              key: 'to', // 缓存数据的key
              data: {
                to: that.data.to

              }, // 要缓存的数据

            });

          }
          else {
            dd.alert({
              title: '',
              content: '发送失败',

            });
          }
        },
      });
    }
  },

  btn2() {
    var that = this
    if (this.data.to === null) {

      dd.alert({
        title: '',
        content: '请先填写邮箱地址',

      });
    }
    else {
      that.setData({

        loading2: true,
      })
      my.httpRequest({

        url: ENV.domain + '/metering/sendMail', // 目标服务器url
        data: {
          to: that.data.to
        },
        success: (res) => {
          console.log(res)
          that.setData({
            loading2: false
          })
          if (res.data === "200") {
            dd.alert({
              title: '',
              content: '发送成功',

            });
            my.setStorage({
              key: 'to', // 缓存数据的key
              data: {
                to: that.data.to

              }, // 要缓存的数据

            });

          }
          else {
            dd.alert({
              title: '',
              content: '发送失败',

            });
          }
        },
      });
    }

  },

  onInputBlur(e) {
    var that = this
  
    if (e.detail.value != this.data.to) {
      that.setData({
        to: e.detail.value
      })
    }
  }

});


