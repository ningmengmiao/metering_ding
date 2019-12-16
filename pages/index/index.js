import { ENV } from '../../profile'

Page({
  data: {
    isAdmin: false,
  },
  onLoad() {
    var that = this
    my.getStorage({
      key: 'user', // 缓存数据的key
      success: (res) => {
// 判断是否为管理员或质检
        if (res.data.isAdmin === true) {
          that.data.isAdmin = true
        }
        else {
          for (var i = 0; i < res.data.roles.length; i++) {
            console.log(res.data.roles[i].id)
            if (res.data.roles[i].id === 385870218) {
              that.setData({
                isAdmin: true
              })
            }
          }

        }
        this.setData({
          userId: res.data.jobnumber,
          isAdmin: that.data.isAdmin

        })
        my.httpRequest({
          // url: 'http://39.100.242.205:8072/metering/findRecord', // 目标服务器url
          url: ENV.domain + '/metering/findRecord', // 目标服务器url
          data: {
            userId: res.data.jobnumber
          },
          success: (res) => {

            that.setData({
              toolArray: res.data
            })
          },
        });
      },
    });

  },

  onPullDownRefresh() {
    var that = this
    my.httpRequest({
      // url: 'http://39.100.242.205:8072/metering/findRecord', // 目标服务器url
      url: ENV.domain + '/metering/findRecord', // 目标服务器url
      data: {
        userId: that.data.userId
      },
      success: (res) => {
dd.stopPullDownRefresh();
        that.setData({
          toolArray: res.data
        })
      },
    });
  },

  tapItem(e) {

    var item = this.data.toolArray[e.target.dataset.index]
    var json = JSON.stringify(item)

    my.navigateTo({
      url: "../detail/detail?item=" + json,
    });

  },
  toAdd() {

    my.navigateTo({
      url: "../add/add",
    });

  },
  toAll() {

    my.navigateTo({
      url: "../all/all",
    });

  },
  toDownload() {

    my.navigateTo({
      url: "../download/download",
    });

  },
});
