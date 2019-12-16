import { ENV } from '../../profile'
Page({
  data: {
    meteringName: "",
    unifyId: "",
    manufacturingId: "",
    meteringRange: "",
    notes: "",
  },

  onMeteringNameTap() {
    var that = this
    my.showActionSheet({

      items: that.data.meteringNameArray,
      success: (res) => {
        this.setData({
          meteringName: that.data.meteringNameArray[res.index],
        });
        // 查型号 返回数组
        my.httpRequest({

          url: ENV.domain + '/metering/findMeteringModel', // 目标服务器url
          data: {
            meteringName: that.data.meteringName
          },
          success: (res) => {

            that.setData({
              meteringModelArray: res.data,
            })
            if (res.data.length === 1) {
              that.setData({
                meteringModel: res.data[0]
              })

              that.findMetering(that.data.meteringModel)

            }

          },
        });

      },
    });
  },
  onMeteringModelTap() {

    var that = this
    if (that.data.meteringModelArray.length !== 1) {
      my.showActionSheet({

        items: that.data.meteringModelArray,
        success: (res) => {
          this.setData({
            meteringModel: that.data.meteringModelArray[res.index],
          });
          that.findMetering(that.data.meteringModel)
        },
      });
    }
    else {
      my.alert({
        title: '暂无更多型号'
      });
    }

  },
  // 查型号id
  findMetering(e) {
    var that = this
    my.httpRequest({
      // url: 'http://39.100.242.205:8072/metering/findMetering', // 目标服务器url
      url: ENV.domain + '/metering/findMetering', // 目标服务器url
      data: {
        meteringName: that.data.meteringName,
        meteringModel: that.data.meteringModel
      },
      success: (res) => {

        that.setData({
          metering: res.data,
        })
      },
    });
  },
  onMeteringValidityTap() {
    var that = this;
    my.datePicker({

      startDate: '2019-1-1',
      endDate: '2039-12-12',
      success: (res) => {

        that.setData({
          meteringValidity: res.date
        })
      },
    });
  },

  onUnifyIdBlur(e) {
    var that = this
    if (e.detail.value !== that.data.unifyId) {
      that.setData({
        unifyId: e.detail.value
      })
    }
  },
  onManufacturingIdBlur(e) {
    var that = this
    if (e.detail.value !== that.data.unifyId) {
      that.setData({
        manufacturingId: e.detail.value
      })
    }
  },
  onMeteringRangeBlur(e) {
    var that = this
    if (e.detail.value !== that.data.meteringRange) {
      that.setData({
        meteringRange: e.detail.value
      })
    }
  },
  onNotesBlur(e) {
    var that = this
    if (e.detail.value !== that.data.notes) {
      that.setData({
        notes: e.detail.value
      })
    }
  },
  finish() {
    var that = this
    my.confirm({
      title: '请确认信息已填写完整',
      content: '技术对象：' + that.data.meteringName + " \n型号：" + that.data.meteringModel + " \n统一编号：" + that.data.unifyId + " \n出厂编号：" + that.data.manufacturingId + " \n检定日期：" + that.data.meteringValidity +" \n测量范围："+that.data.meteringRange,

      success: (res) => {
        if (res.confirm) {
          my.httpRequest({

            url: ENV.domain + '/metering/addRecord', // 目标服务器url
            data: {
              meteringId: that.data.metering[0].meteringId,
              unifyId: that.data.unifyId,
              meteringValidity: that.data.meteringValidity,
              meteringRange: that.data.meteringRange,
              departmentId: that.data.department[0],
              userId: that.data.userId,
              ddName: that.data.name,
              manufacturingId: that.data.manufacturingId,
              notes: that.data.notes,
            },
            success: (res) => {
              my.redirectTo({
                url: '/pages/index/index', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                success: (res) => {

                },
              });

            },
          });


        }
      }
    });
  },


  onLoad() {
    var that = this
    my.getStorage({
      key: 'user', // 缓存数据的key
      success: (res) => {
        that.setData({
          userId: res.data.jobnumber,
          name: res.data.name,
          department: res.data.department,

        })
      },
    });

    // 查技术对象 返回数组
    my.httpRequest({

      url: ENV.domain + '/metering/findMeteringNameArray', // 目标服务器url
      success: (res) => {

        that.setData({
          meteringNameArray: res.data,
        })
      },
    });



  },
});
