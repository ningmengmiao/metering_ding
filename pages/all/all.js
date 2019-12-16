import { ENV } from '../../profile'
Page({
  data: {
    meteringName: "",
    department: "",
    meteringStatus: "",
    filterShow: false,
    filterItems: [],
    down: "/icon/arrow_down.svg",
    up: "/icon/arrow_up.svg",

  },
  tapItem(e) {
    console.log(e)
    var item = this.data.toolArray[e.target.dataset.index]
    var json = JSON.stringify(item)

    my.navigateTo({
      url: "../detail/detail?item=" + json,
    });
  },
  search(res) {
    var that = this
    my.httpRequest({
      url: ENV.domain + '/metering/searchRecord', // 目标服务器url
      data: {
        str: res,
      },
      success: (res) => {
        console.log(res)
        that.setData({
          toolArray: res.data,
        })
      },
    });
  },

  onBtn1Tap() {
    var that = this
    this.setData({
      filterItems: [],
      btnIcon2: this.data.down,
      btnIcon3: this.data.down,
    })
    if (that.data.btnIcon1 === that.data.down) {
      my.httpRequest({
        url: ENV.domain + '/metering/findMeteringName', // 目标服务器url
        success: (res) => {

          for (var i = 0; i < res.data.length; i++) {
            that.data.filterItems.push({
              "id": res.data[i].meteringName,
              "item": res.data[i].meteringName,
            })
          }
          that.data.filterItems.unshift({
            "id": "",
            "item": "无",
          }),
            that.data.filterItems.unshift({
              "name": "meteringName",
            }),

            that.setData({
              filterItems: that.data.filterItems,
              btnIcon1: that.data.up,
            })
        },
      });

      that.setData({
        filterShow: true,
      })
    }
    else {
      that.onMaskTap();
    }
  },
  onBtn2Tap() {
    var that = this
    this.setData({
      filterItems: [],
      btnIcon1: this.data.down,
      btnIcon3: this.data.down,
    })
    if (that.data.btnIcon2 === that.data.down) {
      my.httpRequest({
        url: ENV.domain + '/metering/getDepartments', // 目标服务器url
        success: (res) => {
          for (var i = 0; i < res.data.length; i++) {
            that.data.filterItems.push({
              "id": res.data[i].name,
              "item": res.data[i].name,
            })
          }
          that.data.filterItems.unshift({
            "id": "",
            "item": "无",
          }),
            that.data.filterItems.unshift({
              "name": "department",
            }),
            that.setData({
              filterItems: that.data.filterItems,
              btnIcon2: that.data.up,
            })
        },
      });
      that.setData({
        filterShow: true,
      })
    }
    else {
      that.onMaskTap();
    }
  },
  onBtn3Tap() {
    var that = this
    this.setData({
      filterItems: [],
      btnIcon1: this.data.down,
      btnIcon2: this.data.down,
    })
    if (that.data.btnIcon3 === that.data.down) {
      that.data.filterItems.unshift({
        "id": "5",
        "item": "已过期",
      }), that.data.filterItems.unshift({
        "id": "4",
        "item": "即将过期",
      }), that.data.filterItems.unshift({
        "id": "3",
        "item": "已送检",
      }), that.data.filterItems.unshift({
        "id": "2",
        "item": "在用",
      }), that.data.filterItems.unshift({
        "id": "1",
        "item": "封存",
      }), that.data.filterItems.unshift({
        "id": "0",
        "item": "已报废",
      }),
        that.data.filterItems.unshift({
          "id": "",
          "item": "无",
        }),
        that.data.filterItems.unshift({
          "name": "meteringStatus",
        }),
        that.setData({
          filterItems: that.data.filterItems,
          btnIcon3: that.data.up,
        }),

        that.setData({
          filterShow: true,
        })
    }
    else {
      that.onMaskTap();
    }

  },


  filtrate() {
    var that = this

    my.httpRequest({
      url: ENV.domain + '/metering/filtrateRecord', // 目标服务器url
      data: {
        meteringName: that.data.meteringName,
        department: that.data.department,
        meteringStatus: that.data.meteringStatus,
      },
      success: (res) => {

        that.setData({
          toolArray: res.data,
        })
      },
    });
  },
  handleCallBack(res) {


    this.setData({
      [this.data.filterItems[0].name]: res[0].id,

    })
    this.filtrate();
    this.onMaskTap();
  },
  onMaskTap() {
    this.setData({
      filterShow: false,
      filterItems: [],
      btnIcon1: this.data.down,
      btnIcon2: this.data.down,
      btnIcon3: this.data.down,
    })
  },

  goTop() {
    my.pageScrollTo({
      scrollTop: 0
    });
  },

  onLoad() {

    this.setData({
      btnIcon1: this.data.down,
      btnIcon2: this.data.down,
      btnIcon3: this.data.down,
    })
    my.httpRequest({
      // url: 'http://39.100.242.205:8072/metering/findRecord', // 目标服务器url
      url: ENV.domain + '/metering/findRecord', // 目标服务器url
      success: (res) => {

        this.setData({
          toolArray: res.data
        })
      },
    });

  },
  onTitleClick() {
    this.goTop();
  },

  onPullDownRefresh() {
    var that = this
    // 页面被下拉
    my.httpRequest({

      url: ENV.domain + '/metering/findRecord', // 目标服务器url
      success: (res) => {
        dd.stopPullDownRefresh();
        this.setData({
          toolArray: res.data,
          meteringName: "",
          department: "",
          meteringStatus: "",
          filterShow: false,
          filterItems: [],
          btnIcon1: that.data.down,
          btnIcon2: that.data.down,
          btnIcon3: that.data.down,
        })
      },
    });

  },

  back() {
    my.navigateBack({

    });
  }
});
